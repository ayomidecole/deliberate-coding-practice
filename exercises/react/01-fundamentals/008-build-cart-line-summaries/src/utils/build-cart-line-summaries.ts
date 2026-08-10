export type CartLine = {
  readonly productId: string;
  readonly productName: string;
  readonly unitPriceCents: number;
  readonly quantity: number;
};

export type CartLineSummary = {
  readonly id: string;
  readonly label: string;
  readonly totalCents: number;
};

export function buildCartLineSummaries(
  lines: readonly CartLine[],
): CartLineSummary[] {
  const line: CartLineSummary[] = lines.map((line) => {
    return {
      id: line.productId,
      label: `${line.quantity} x ${line.productName}`,
      totalCents: line.quantity * line.unitPriceCents
      }
  })

  return line
}
