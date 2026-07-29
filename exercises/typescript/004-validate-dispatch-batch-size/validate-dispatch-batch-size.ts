export function isValidDispatchBatchSize(batchSize: number): boolean {
    if (Number.isInteger(batchSize) && batchSize >= 1 && batchSize <= 100) {
        return true;
    }
    return false;
}
