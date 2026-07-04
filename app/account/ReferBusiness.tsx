"use client";

import { useState } from "react";
import { Button } from "@/ds/components/core/Button";

const field: React.CSSProperties = { width: "100%", padding: "12px 14px", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--shell)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", outline: "none" };

export default function ReferBusiness() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const url = "https://book.sey.la/studios";
  const msg = `You should put your studio on book.sey.la — clients can book you online and it's free for the first 3 months. Add yours here: ${url}`;
  const copy = (t: string, tag: string) => { navigator.clipboard?.writeText(t).then(() => { setCopied(tag); setTimeout(() => setCopied(""), 1500); }); };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, cursor: "pointer" }} onClick={() => setOpen(!open)}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-lead)" }}>Invite a studio → earn credit</div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>Know a great salon? Bring them on board.</div>
        </div>
        <span style={{ color: "var(--clay)", fontWeight: 700 }}>{open ? "–" : "+"}</span>
      </div>
      {open && (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <textarea readOnly value={msg} style={{ ...field, minHeight: 78, resize: "none" }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button as="a" href={`https://wa.me/?text=${encodeURIComponent(msg)}`} size="sm">Invite on WhatsApp</Button>
            <button onClick={() => copy(msg, "m")} style={{ ...field, width: "auto", cursor: "pointer", fontWeight: 600, color: "var(--cocoa-80)" }}>{copied === "m" ? "Copied ✓" : "Copy message"}</button>
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-50)" }}>When a studio you invite joins and subscribes, we credit your wallet. Payouts switch on after launch.</p>
        </div>
      )}
    </div>
  );
}
