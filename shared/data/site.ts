export const HBD_EMAIL = "hello@hairbydebz.co.uk";
export const HBD_AREA = "Northwest London, Finchley Road";
export const HBD_RESPONSE = "[response time, to confirm with Debz]";
export const HBD_DEPOSIT = 0.2;

export const NAV: ReadonlyArray<readonly [href: string, label: string]> = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/gallery", "Gallery"],
  ["/training", "Training"],
  ["/about", "About & Contact"],
];

export const SOCIALS = {
  instagram: "https://www.instagram.com/hair_by_debz",
  tiktok: "https://www.tiktok.com/@hairbydebz",
} as const;

/** Canonical origin. Set NEXT_PUBLIC_SITE_URL in the host's env to the real domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://hairbydebz.co.uk").replace(/\/$/, "");
export const SITE_NAME = "Hair By Debz";
export const SITE_DESC =
  "Frontal installs, sleek ponytails and bridal updos in Northwest London. Finished so cleanly nobody will ever find the lace. By appointment only.";
