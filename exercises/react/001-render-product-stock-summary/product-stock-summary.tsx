export type ProductStockSummaryProps = {
    readonly productName: string;
    readonly availableUnits: number;
};

export function ProductStockSummary({
    productName,
    availableUnits,
}: ProductStockSummaryProps) {
    return (
        <div>
            <h2>{productName}</h2>
            <p>{availableUnits} units available</p>
        </div>
    );
}
