import { type ChangeEvent, useState } from 'react';

import { OrderResults } from '../../components/orders/order-results';
import { OrderSearchField } from '../../components/orders/order-search-field';
import type { OrderSummary } from '../../types/order-summary';

const ORDER_SUMMARIES: readonly OrderSummary[] = [
    {
        id: 'order-2048',
        reference: 'ORD-2048',
        customerName: 'Northwind Labs',
    },
    {
        id: 'order-4096',
        reference: 'ORD-4096',
        customerName: 'Contoso Foods',
    },
    {
        id: 'order-8192',
        reference: 'SHIP-8192',
        customerName: 'Northwind Retail',
    },
];

function matchesSearchTerm(order: OrderSummary, searchTerm: string): boolean {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return (
        order.reference.toLowerCase().includes(normalizedTerm) ||
        order.customerName.toLowerCase().includes(normalizedTerm)
    );
}

export function SearchOrdersFeature() {
    const [search, setSearch] = useState('');

    const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.currentTarget.value);
    };

    const visibleOrders = ORDER_SUMMARIES.filter((order) => {
        return matchesSearchTerm(order, search);
    });

    return (
        <section aria-labelledby="search-heading">
            <h2 id="search-heading">Search orders</h2>
            <OrderSearchField searchTerm={search} onChange={searchHandler} />
            <OrderResults orders={visibleOrders} />
        </section>
    );
}
