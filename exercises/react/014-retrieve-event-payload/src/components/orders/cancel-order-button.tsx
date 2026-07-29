export type CancelOrderButtonProps = {
    readonly orderId: string;
    readonly orderNumber: string;
    readonly onCancel: (orderId: string) => void;
};

export function CancelOrderButton({
    orderId,
    orderNumber,
    onCancel,
}: CancelOrderButtonProps) {
    function cancelHandler() {
        onCancel(orderId);
    }
    return (
        <button type="button" onClick={cancelHandler}>
            Cancel order {orderNumber}
        </button>
    );
}
