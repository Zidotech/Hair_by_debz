import type { ImgKey } from "./media";

export interface HairStyle {
  id: string;
  name: string;
  /** Shorter name for cards (home page, booking grid); the price list keeps the full name */
  short?: string;
  price: number | null;
  time: string | null;
  /** Photos for the booking card. Services Debz hasn't sent media for yet have none and show the logo tile. */
  imgs?: [ImgKey, ImgKey];
  blurb: string;
  /** Shown on the home page's "Most-booked" row */
  featured?: boolean;
  /**
   * How the row appears on the price list. Omit to use name/price/time as they are,
   * `false` to keep it bookable but off the list, or override the wording.
   */
  list?: false | { name?: string; priceText?: string; sub?: string };
}

// One list drives both the price list and the booking page, so every "Book" link lands on a selected service.
// Prices from Debz's price list (Oct 2026). Training prices are still samples.
export const SERVICES: HairStyle[] = [
  { id: "custom-hairline", name: "Custom hairline installation (frontal)", price: 100, time: "3 hrs", imgs: ["laceCurly", "lacePink"], blurb: "Frontal installed with a custom hairline. Extra customization adds £15.", list: { sub: "3 hrs · + £15 per extra customization" } },
  { id: "styling", name: "Styling", price: 50, time: null, blurb: "Curls or any style you want to recreate. Doesn’t include installation." },
  { id: "customization", name: "Customization (frontal / closure) only", price: 45, time: null, blurb: "Hairline customization on your frontal or closure, without an install." },
  { id: "closure", name: "Closure installation", price: 90, time: null, imgs: ["closureInstall", "lacePink"], blurb: "Low-maintenance and protective, natural finish." },
  { id: "frontal-360", name: "360 frontal install", price: 150, time: "5 hrs", blurb: "Full 360 frontal installed and blended all the way round." },
  { id: "half-up", name: "Frontal installation: half up, half down", price: 110, time: "3 hrs", imgs: ["halfUp", "halfUp2"], blurb: "Half up, half down on a melted frontal." },
  { id: "side-part", name: "Custom hairline frontal installation: centre or side parting with curls", short: "Parting with curls", price: 110, time: "3 hrs", imgs: ["side2", "side1"], blurb: "Centre or side parting with a melted custom hairline, styled in soft curls." },
  { id: "bussdown", name: "Custom hairline frontal installation: bussdown (straight / curly hair)", short: "Bussdown install", price: 100, time: "2.5 hrs", imgs: ["bussSleek", "bussCurls"], blurb: "Dead-centre part, flat-laid, custom hairline with invisible lace. Straight or curly hair.", featured: true },
  { id: "frontal-updo", name: "Frontal updo wig install", price: 115, time: "4 hrs", imgs: ["updo", "bday2"], blurb: "Sculpted updo on a frontal unit, polished from every angle.", featured: true },
  { id: "layering", name: "Layering", price: 40, time: null, imgs: ["layers", "layers"], blurb: "Layers cut into your unit for movement and body." },
  { id: "baby-hairs", name: "Frontal install with baby hairs", price: 105, time: "3 hrs", imgs: ["babyHair", "laceCurly"], blurb: "Frontal install finished with soft, natural baby hairs." },
  { id: "frontal-pony", name: "Frontal ponytail", price: 120, time: "4 hrs", imgs: ["ponyBun", "debz2"], blurb: "Melted frontal hairline into a long, swinging pony. Hair washed before arrival, no hair cream.", featured: true },
  { id: "updo-base", name: "Frontal pony updo", price: 130, time: "4 hrs", blurb: "Ponytail updo with a melted frontal hairline." },
  { id: "double-pony", name: "Double frontal pony", price: 160, time: "5 hrs", imgs: ["doublePony", "ponyBun"], blurb: "Two frontals, one seamless pony." },
  { id: "sew-in", name: "Frontal & closure sew-in", price: 130, time: "4 hrs", imgs: ["sewIn", "ponySewIn"], blurb: "Sew-in with a frontal or closure, flat and natural." },
  { id: "natural-sew-in", name: "Natural hair sew-in", price: 70, time: "3 hrs", imgs: ["naturalSewIn", "ponySewIn"], blurb: "Sew-in on your natural hair. Length and fullness can affect the price." },
  { id: "glueless-frontal", name: "Glueless frontal", price: 95, time: "3 hrs", blurb: "Glueless frontal install.", list: { name: "Frontal / closure glueless", priceText: "£95 / £90", sub: "3 hrs · frontal £95 · closure £90" } },
  { id: "glueless-closure", name: "Glueless closure", price: 90, time: "3 hrs", blurb: "Glueless closure install.", list: false },
  { id: "revamping", name: "Revamping", price: 50, time: null, blurb: "Refresh and restyle a unit you already own." },
  { id: "bridal", name: "Bridal hair", price: null, time: "Quoted", imgs: ["bridal1", "bridal2"], blurb: "Wedding-day installs and updos, finished to last from the ceremony to the after-party.", featured: true },
];

/** Every service Debz offers, for the booking page, home page and gallery links. */
export const STYLES = SERVICES;

export interface BookingType {
  id: "standard" | "same-day" | "emergency";
  name: string;
  d: string;
  fee: string;
  /** Extra charge in £ on top of the service price */
  extra: number | null;
}

export const BOOKING_TYPES: BookingType[] = [
  { id: "standard", name: "Standard", d: "Request any day, Monday to Sunday, 10AM to 7PM (Wed 4:30PM to 9PM, Fri 7PM to 10PM).", fee: "No extra fee", extra: null },
  { id: "same-day", name: "Same-day", d: "For an appointment today, if Debz can fit you in.", fee: "+ £20", extra: 20 },
  { id: "emergency", name: "Emergency", d: "Urgent or outside 10AM to 7PM, e.g. a last-minute event.", fee: "+ £40", extra: 40 },
];

// Booking policy: final wording from the designer's flyer.
export const POLICY: ReadonlyArray<readonly [string, string]> = [
  ["Deposit", "A 20% payment only confirms and validates your booking."],
  ["Appointment expiry", "Appointments expire 30 minutes after the scheduled time."],
  ["Frontal pony", "Hair must be washed before arrival. No hair cream included."],
  ["Frontal installation", "Hair must be woven before arrival (extra £25 if Debz must do it)."],
  ["Sending your unit", "Frontals or wigs must be sent 3 days prior to your appointment."],
  ["Natural hair", "Natural hair attracts an extra charge depending on how long or full the hair is."],
];

export const LATE: ReadonlyArray<readonly [string, string]> = [
  ["10 mins late", "+£10"],
  ["15 mins late", "+£20"],
  ["30 mins late", "+£30"],
];

export interface TrainingProgramme {
  id: string;
  name: string;
  /** Tag shown on the card */
  tag: string;
  /** null = no public price; the card sends people to the enquiry form */
  price: number | null;
  pts: string[];
  featured?: boolean;
}

export const TRAINING: TrainingProgramme[] = [
  { id: "month", name: "Two-Week Class", tag: "2 weeks · 3 days a week", price: 800, pts: ["Lace prep & customisation", "Frontal & closure installs", "Kit list provided"] },
  { id: "beginner", name: "Beginner Programme", tag: "Beginner", price: null, pts: ["Start from zero", "Installs, ponytails & updos", "Live client days"], featured: true },
  { id: "master", name: "One-to-One Master Class", tag: "One-to-one", price: null, pts: ["Just you and Debz", "Focus on the skill you choose", "Tailored to your level"] },
];

export const FAQS: ReadonlyArray<readonly [q: string, a: string]> = [
  ["Where are you based?", "I am based in Northwest London, Finchley Road."],
  ["How far in advance should I send my frontals or closures before my appointment?", "You only need to send your frontals or closures 3 days prior to your appointment."],
  ["What should I do if I need to do a same-day drop-off?", "Please let me know in advance if you would be doing a same-day drop off. This adds extra time to the service and I need to make sure it doesn’t affect clients after you."],
  ["Do you offer emergency slots?", "Yes I do. Emergency slots are £40 extra."],
  ["What is the Styling service?", "For my girlies that struggle to curl their hair, or any style you want to recreate. Please note this service doesn’t include installation. It can also be booked same day."],
  ["How can I confirm the time to drop off my hair?", "Please text me through the link on my bio to confirm your drop off time."],
  ["What should I do if I decide to mail my hair instead of dropping it off?", "Please text me through the link on my bio with your tracking number, to ensure I’m available to collect your parcel."],
  ["Which days and times are you available?", "I’m available every day from 10AM to 7PM. On Wednesdays I take appointments from 4:30PM to 9PM, and on Fridays from 7PM to 10PM."],
];

export const FAQ_NOTICE: ReadonlyArray<readonly [string, string]> = [
  ["Phone line is open from", "10AM – 7PM"],
  ["Emails are responded to within the hours of", "10AM – 7PM"],
  ["For urgent enquiries please call", "+44 7344 386382"],
];
