export type OrderApiRecord = {
    readonly id: string
    readonly reference: string
    readonly customer_name: string
    readonly total_cents: number
};

export type OrderListApiResponse = {
    readonly orders: readonly OrderApiRecord[]
    readonly next_cursor: string | null
};
