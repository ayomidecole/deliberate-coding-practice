export type StockBadgeTone = "available" | "sold-out";

export function selectStockBadgeTone(
  availableUnits: number,
): StockBadgeTone {
  return "available";
}
