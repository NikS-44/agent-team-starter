/** Mask PAN for on-screen display; copy flow uses the full number separately. */
export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length <= 4) return cardNumber;
  return `${"•".repeat(cardNumber.length - 4)}${cardNumber.slice(-4)}`;
}

/** Group PAN digits as spaced quartets (e.g. 4242 4242 4242 4242). */
export function formatPanGroups(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** Same grouping as `formatPanGroups`, digits replaced with bullets (nothing revealed). */
export function maskPanFully(cardNumber: string): string {
  return formatPanGroups(cardNumber).replace(/\d/g, "•");
}
