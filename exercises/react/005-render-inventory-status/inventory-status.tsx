export type InventoryStatusProps = {
    readonly productName: string;
    readonly availableUnits: number;
};

export function InventoryStatus({
    productName,
    availableUnits,
}: InventoryStatusProps) {
    if (availableUnits === 0) {
        return (
            <div>
                <h2>{productName}</h2>
                <p>Sold out</p>
            </div>
        );
    }
    return (
        <div>
            <h2>{productName}</h2>
            <p>{availableUnits} units available</p>
        </div>
    );
}
