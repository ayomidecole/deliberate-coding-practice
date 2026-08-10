export type ShipmentApiRecord = {
    readonly shipment_id: string
    readonly reference: string
    readonly warning_codes: readonly string[]
    readonly estimated_delivery: string | null
};

export type ShipmentListApiResponse = {
    readonly shipments: readonly ShipmentApiRecord[]
    readonly generated_at: string
};
