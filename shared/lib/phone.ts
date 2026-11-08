/**
 * UK numbers only (mobiles 07… and landlines 01/02/03…). Accepts 07700 900123, 7700900123,
 * +44 7700 900123, +44 (0)7700 900123 and 0044 7700 900123. Returns "+44 …" or null.
 * Non-geographic 08/09 numbers are rejected, so foreign numbers like 0810… don't slip through.
 */
export function normalizeUkPhone(input: string): string | null {
  const t = input.trim();
  if (!/^[+\d][\d\s()+.\-]*$/.test(t)) return null;
  let d = t.replace(/\D/g, "");
  if (d.startsWith("0044")) d = d.slice(4);
  else if (t.startsWith("+") && d.startsWith("44")) d = d.slice(2);
  d = d.replace(/^0/, "");
  if (d.startsWith("7")) return d.length === 10 ? "+44 " + d.slice(0, 4) + " " + d.slice(4) : null;
  if (/^[123]\d{8,9}$/.test(d)) return "+44 " + d;
  return null;
}

export const isValidPhone = (v: string): boolean => normalizeUkPhone(v) !== null;
