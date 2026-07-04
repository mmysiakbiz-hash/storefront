"use client";

import { useState } from "react";
import { Logo } from "@/ds/components/brand/Logo";
import { Button } from "@/ds/components/core/Button";
import { createClient } from "@/lib/supabase/client";

const field: React.CSSProperties = { width: "100%", padding: "13px 15px", fontSize: "var(--text-body)", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", outline: "none" };

export default function LoginForm() {
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const [stage, setStage] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function sendCode() {
    setBusy(true); setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { shouldCreateUser: true } });
      if (error) throw error;
      setStage("code");
    } catch (e: any) { setErr(e?.message || "Couldn’t send the code."); }
    setBusy(false);
  }

  async function verify() {
    setBusy(true); setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: "email" });
      if (error) throw error;
      const next = new URLSearchParams(window.location.search).get("next") || "/panel";
      window.location.href = next;
    } catch (e: any) { setErr(e?.message || "That code didn’t work."); }
    setBusy(false);
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "0 var(--gutter)" }}>
      <div style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
        <a href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 28 }}><Logo product="book" size="lg" /></a>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-sm)", margin: "0 0 8px" }}>
          {stage === "email" ? "Sign in" : "Check your email"}
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", margin: "0 0 26px" }}>
          {stage === "email" ? "We’ll email you a one-time code — no password needed." : `Enter the 6-digit code we sent to ${email}.`}
        </p>

        {!configured ? (
          <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: 16 }}>
            Sign-in switches on once the app is connected to its database.
          </p>
        ) : stage === "email" ? (
          <div style={{ display: "grid", gap: 12 }}>
            <input style={field} type="email" value={email} placeholder="you@studio.com" onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && email && sendCode()} />
            <Button onClick={sendCode} disabled={busy || !email} full>{busy ? "Sending…" : "Email me a code"}</Button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <input style={{ ...field, textAlign: "center", letterSpacing: "0.3em", fontSize: 20 }} inputMode="numeric" value={code} placeholder="000000" onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && code && verify()} />
            <Button onClick={verify} disabled={busy || !code} full>{busy ? "Verifying…" : "Sign in"}</Button>
            <button onClick={() => { setStage("email"); setCode(""); setErr(null); }} style={{ background: "none", border: "none", color: "var(--cocoa-60)", fontSize: "var(--text-sm)", cursor: "pointer", fontFamily: "var(--font-body)" }}>← Use a different email</button>
          </div>
        )}

        {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)", marginTop: 14 }}>⚠ {err}</p>}
      </div>
    </main>
  );
}
