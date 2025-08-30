import React from "react";
export default function DebugBanner({ text = "App mounted" }: { text?: string }) {
  return (
    <div style={{ position: "fixed", bottom: 8, left: 8, background: "#1f2937", color: "#e5e7eb", padding: "6px 10px", borderRadius: 6, fontSize: 12, zIndex: 9999 }}>
      {text}
    </div>
  );
}