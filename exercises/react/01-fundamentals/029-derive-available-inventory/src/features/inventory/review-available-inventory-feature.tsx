import { InventoryResults } from '../../components/inventory/inventory-results';
import type { InventoryItem } from '../../types/inventory-item';

const INVENTORY_ITEMS: readonly InventoryItem[] = [
    {
        id: 'inventory-desk-lamp',
        name: 'Desk lamp',
        quantity: 4,
    },
    {
        id: 'inventory-usb-c-dock',
        name: 'USB-C dock',
        quantity: 0,
    },
    {
        id: 'inventory-monitor-arm',
        name: 'Monitor arm',
        quantity: 2,
    },
];

export function ReviewAvailableInventoryFeature() {
    const availableItems = INVENTORY_ITEMS.filter((item) => {
        return item.quantity > 0;
    });

    return (
        <section aria-labelledby="inventory-header">
            <h2 id="inventory-header">Available inventory</h2>
            <InventoryResults items={availableItems} />
        </section>
    );
}
