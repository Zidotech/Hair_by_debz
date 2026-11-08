export const gbp = (n: number | null | undefined): string =>
  n == null
    ? "Price on request"
    : "£" +
      n.toLocaleString("en-GB", {
        minimumFractionDigits: n % 1 ? 2 : 0,
        maximumFractionDigits: 2,
      });
