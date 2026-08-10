import type { Incident } from '../../domain/incident';

export type IncidentReviewListProps = {
    readonly incidents: readonly Incident[];
    readonly onIncidentSelect: (incidentId: string) => void;
};

export function IncidentReviewList({
    incidents,
    onIncidentSelect,
}: IncidentReviewListProps) {
    return (
        <div>
            {incidents.map((incident) => {
                const headingId = `incident-review-${incident.id}-heading`;

                return (
                    <article key={incident.id} aria-labelledby={headingId}>
                        <h3 id={headingId}>{incident.summary}</h3>
                        <p>Severity: {incident.severity}</p>
                        <ul
                            aria-label={`${incident.summary} affected services`}
                        >
                            {incident.affectedServices.map((service) => (
                                <li key={service}>{service}</li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={() => onIncidentSelect(incident.id)}
                        >
                            Review {incident.summary}
                        </button>
                    </article>
                );
            })}
        </div>
    );
}
