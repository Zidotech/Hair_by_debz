import { InstagramLogo, TiktokLogo } from "@phosphor-icons/react/ssr";
import { SOCIALS } from "@/shared/data/site";

const LINKS = [
  ["Instagram", SOCIALS.instagram, InstagramLogo],
  ["TikTok", SOCIALS.tiktok, TiktokLogo],
] as const;

export function SocialLinks({ border, color }: { border: string; color?: string }) {
  return (
    <>
      {LINKS.map(([label, href, Icon]) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label + " (opens in a new tab)"}
          style={{ width: 44, height: 44, borderRadius: "50%", border, display: "flex", alignItems: "center", justifyContent: "center", color, textDecoration: "none" }}
        >
          <Icon size={20} aria-hidden="true" />
        </a>
      ))}
    </>
  );
}
