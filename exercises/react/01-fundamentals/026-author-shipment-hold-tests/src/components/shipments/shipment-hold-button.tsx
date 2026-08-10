type ShipmentHoldButtonProps = {
    readonly onToggle: () => void;
};

export function ShipmentHoldButton({ onToggle }: ShipmentHoldButtonProps) {
    return (
        <button type="button" onClick={onToggle}>
            Toggle shipment hold
        </button>
    );
}
