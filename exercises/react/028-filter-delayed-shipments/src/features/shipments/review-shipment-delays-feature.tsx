import { useState } from 'react';

import { ShipmentDelayFilter } from '../../components/shipments/shipment-delay-filter';
import { ShipmentResults } from '../../components/shipments/shipment-results';
import type { ShipmentSummary } from '../../types/shipment-summary';

const SHIPMENT_SUMMARIES: readonly ShipmentSummary[] = [
    {
        id: 'shipment-201',
        reference: 'SHP-201',
        isDelayed: true,
    },
    {
        id: 'shipment-305',
        reference: 'SHP-305',
        isDelayed: false,
    },
    {
        id: 'shipment-418',
        reference: 'SHP-418',
        isDelayed: true,
    },
];

export function ReviewShipmentDelaysFeature() {
    const [delayed, setDelayed] = useState(false);

    const handleFilter = (nextDelayed: boolean) => {
        setDelayed(nextDelayed);
    };

    const visibleShipments = delayed
    ? SHIPMENT_SUMMARIES.filter((shipment) => shipment.isDelayed)
    : SHIPMENT_SUMMARIES;

    return (
        <section aria-labelledby="shipment-header">
            <h2 id="shipment-header">Review shipment delays</h2>
            <ShipmentDelayFilter
                showDelayedOnly={delayed}
                onFilterChange={handleFilter}
            />
            <ShipmentResults
                shipments={delayed ? visibleShipments : SHIPMENT_SUMMARIES}
            />
        </section>
    );
}
