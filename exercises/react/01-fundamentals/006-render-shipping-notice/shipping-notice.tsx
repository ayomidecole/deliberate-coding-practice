export type ShippingNoticeProps = {
    readonly orderNumber: string;
    readonly isDelayed: boolean;
};

export function ShippingNotice({
    orderNumber,
    isDelayed,
}: ShippingNoticeProps) {
    if (isDelayed) {
        return (
            <div>
                <h2>Order {orderNumber}</h2>
                <p>Delivery delayed</p>
            </div>
        );
    }
    return (
        <div>
            <h2>Order {orderNumber}</h2>
            <p>Delivery on schedule</p>
        </div>
    );
}
