import { Star } from "@phosphor-icons/react/ssr";

export function Stars() {
  return (
    <span role="img" aria-label="5 stars" style={{ color: "var(--clay)", display: "inline-flex", gap: 3 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={16} weight="fill" aria-hidden="true" />
      ))}
    </span>
  );
}
