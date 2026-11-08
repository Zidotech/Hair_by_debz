// Debz's own work. Files live in /public/media.
const IMG_FILES = {
  curlsLong: "side-3",
  salonB: "debz",
  sign: "debz-2",
  salonC: "lace-curly",
  salonA: "side-1",
  stylist: "bday-5",
  ponyBun: "pony-bun",
  updo: "updo-blonde",
  bridal1: "bridal-1",
  bridal2: "bridal-2",
  laceCurly: "lace-curly",
  lacePink: "lace-pink",
  layers: "layers",
  side1: "side-1",
  side2: "side-2",
  side3: "side-3",
  bday1: "bday-1",
  bday2: "bday-2",
  bday3: "bday-3",
  bday4: "bday-4",
  bday5: "bday-5",
  debz: "debz",
  debz2: "debz-2",
  bussSleek: "bussdown-sleek",
  ponySewIn: "pony-sew-in",
  bridalPrep1: "bridal-prep1",
  bridalPrep2: "bridal-prep2",
} as const;

// Video posters reused as still photos
const POSTER_IMGS = {
  bussMiddle: "/media/vid/lace-middle.webp",
  bussNoPart: "/media/vid/no-part.webp",
  halfUp: "/media/vid/halfup.webp",
  halfUp2: "/media/vid/halfup-2.webp",
  babyHair: "/media/vid/baby-hair.webp",
  doublePony: "/media/vid/double-pony.webp",
  sewIn: "/media/vid/sew-in.webp",
  closureInstall: "/media/vid/closure-installation.webp",
  naturalSewIn: "/media/vid/natural-hair-sew-in.webp",
} as const;

export type ImgKey = keyof typeof IMG_FILES | keyof typeof POSTER_IMGS;

export const IMG = {
  ...Object.fromEntries(Object.entries(IMG_FILES).map(([k, f]) => [k, `/media/img/${f}.webp`])),
  ...POSTER_IMGS,
} as Record<ImgKey, string>;

export const IMG_ALT: Partial<Record<ImgKey, string>> = {
  salonA: "Burgundy side-part frontal install",
  salonB: "Debz, founder of Hair By Debz",
  salonC: "Melted lace hairline with baby hairs",
  sign: "Debz in a sleek side ponytail",
  curlsLong: "Long black body-wave side-part install at the Hair By Debz studio",
  stylist: "Debz styling a birthday updo",
};

export const VID_NAMES = [
  "pony-bun", "pony-bun2", "double-pony", "updo-v1", "halfup",
  "bridal-a", "bridal-b", "bridal-d", "bridal-e", "side-burgundy",
  "no-part", "layers-curl", "layers-mirror", "layers-unit", "layers-blonde",
  "rollers", "blonde-bob", "layers-flip", "sew-in", "lace-blonde",
  "lace-curly-v", "lace-pink-v", "baby-hair", "lace-middle", "bday-glam",
  "train-install", "train-cert",
  // new set (Nov 2026)
  "after-party-bridal", "bridal-making", "bussdown-curls", "bussdown-straight", "bussdown-sleek",
  "closure-install", "soft-curls-a", "soft-curls-b", "pony-updo", "pony-sew-in", "pony-side-bun",
  "bun-baby-hairs", "pony-sleek-high", "pony-short", "pony-high", "pony-curled-ends", "halfup-2",
  "layered-burgundy", "natural-pony", "side-money-piece",
  // Nov 8 2026
  "closure-installation", "natural-hair-sew-in",
] as const;

export type VidName = (typeof VID_NAMES)[number];

/** Poster = first frame. No autoplay anywhere; production should stream from a video host. */
export const VID = Object.fromEntries(
  VID_NAMES.map((n) => [n, { src: `/media/vid/${n}.mp4`, poster: `/media/vid/${n}.webp` }]),
) as Record<VidName, { src: string; poster: string }>;
