const MINOR_UNITS_PER_MAJOR = 100;

export function majorToMinorUnits(amount: number): number {
  return Math.round(amount * MINOR_UNITS_PER_MAJOR);
}

export function minorUnitsToMajor(amount: number): number {
  return amount / MINOR_UNITS_PER_MAJOR;
}

export function formatMoney(
  priceInMinorUnits: number,
  currency = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(minorUnitsToMajor(priceInMinorUnits));
}
