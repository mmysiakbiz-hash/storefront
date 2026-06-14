/*
 * StoreKit storefront loader
 * --------------------------------------------------------------------------
 * Drop this into any static storefront (Ocean Basket, Anse Kerlan, or a future
 * shop on the same schema). It fetches the whole store payload from the admin
 * API and exposes a small helper surface. No build step, no framework.
 *
 * Setup — before this script:
 *   <script>
 *     window.STOREKIT_API   = "https://your-admin.vercel.app"; // the deployed admin
 *     window.STOREKIT_STORE = "ocean-basket";                  // or "anse-kerlan"
 *     window.STOREKIT_LOCALE = "en";                           // active UI locale
 *   </script>
 *   <script src="loader.js"></script>
 *
 * Usage:
 *   const data = await StoreKit.bootstrap();
 *   // data.store, data.products (each with .cuts), data.shared_options,
 *   // data.board, data.zones, data.map, data.content, data.testimonials, data.picker
 *
 *   StoreKit.t(product.name, StoreKit.locale)        // pick a locale string
 *   StoreKit.fillContent(data.content)               // hydrate [data-cms="hero.h1"] nodes
 *   await StoreKit.placeOrder({ customer, zone_code, slot, items:[{product_id, qty, option_ids:[]}] })
 */
(function (global) {
  var API = (global.STOREKIT_API || '').replace(/\/$/, '');
  var STORE = global.STOREKIT_STORE || 'ocean-basket';
  var LOCALE = global.STOREKIT_LOCALE || 'en';

  function t(value, locale, fallback) {
    if (!value || typeof value !== 'object') return fallback || '';
    locale = locale || LOCALE;
    if (value[locale]) return value[locale];
    var keys = Object.keys(value);
    return keys.length ? value[keys[0]] : fallback || '';
  }

  async function bootstrap() {
    var res = await fetch(API + '/api/' + STORE + '/bootstrap', {
      headers: { accept: 'application/json' },
    });
    if (!res.ok) throw new Error('StoreKit bootstrap failed: ' + res.status);
    return res.json();
  }

  async function placeOrder(payload) {
    var res = await fetch(API + '/api/' + STORE + '/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    var json = await res.json();
    if (!res.ok) throw new Error(json.error || 'order failed');
    return json; // { order_no, subtotal, delivery_fee, total, currency }
  }

  /* Replace text of every element marked <... data-cms="hero.h1"> with the
     matching content block. Uses innerHTML so simple <em>/<br> in copy render. */
  function fillContent(content, locale) {
    if (!content) return;
    var nodes = document.querySelectorAll('[data-cms]');
    nodes.forEach(function (el) {
      var key = el.getAttribute('data-cms');
      if (content[key]) el.innerHTML = t(content[key], locale || LOCALE);
    });
  }

  global.StoreKit = {
    bootstrap: bootstrap,
    placeOrder: placeOrder,
    fillContent: fillContent,
    t: t,
    get locale() { return LOCALE; },
    set locale(v) { LOCALE = v; },
    STORE: STORE,
    API: API,
  };
})(window);
