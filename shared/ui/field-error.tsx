import type { ReactNode } from "react";

/** Never colour alone: icon + written message. Shakes in when it appears. */
export function FieldError({ id, children, shake = true }: { id?: string; children: ReactNode; shake?: boolean }) {
  return (
    <div id={id} role="alert" style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--error)", fontSize: 14, fontWeight: 600, marginTop: 8, animation: shake ? "pShake .35s" : undefined }}>
      <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--error)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>!</span>
      {children}
    </div>
  );
}
