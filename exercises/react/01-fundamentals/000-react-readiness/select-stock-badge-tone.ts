export type StockBadgeTone = 'available' | 'sold-out';

export function selectStockBadgeTone(availableUnits: number): StockBadgeTone {
    if (availableUnits <= 0) {
        return 'sold-out';
    }

    return 'available';
}
