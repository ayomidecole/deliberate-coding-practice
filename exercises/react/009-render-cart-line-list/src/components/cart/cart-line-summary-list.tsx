import type { CartLineSummary } from '../../types/cart-line-summary';

export type CartLineSummaryListProps = {
    readonly summaries: readonly CartLineSummary[];
};

export function CartLineSummaryList({ summaries }: CartLineSummaryListProps) {
    return (
        <section>
            <h2>Cart summary</h2>
            <ul>
                {summaries.map((summary) => {
                    return (
                        <li key={summary.id}>
                            {summary.label}: {summary.totalCents} cents
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
