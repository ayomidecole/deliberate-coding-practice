import type { MonitoredService } from '../../domain/monitored-service';
import { Badge } from '../ui/badge';
import { Spinner } from '../ui/spinner';

export type ServiceHealthSummaryProps = {
    readonly service: MonitoredService;
};

export function ServiceHealthSummary({ service }: ServiceHealthSummaryProps) {
    const isDegraded = service.health === 'degraded';

    return (
        <article className="service-health-card">
            <h3>{service.name}</h3>
            <p>Owner: {service.ownerTeam}</p>
            <p>
                Health:
                <Badge variant={isDegraded ? 'destructive' : 'secondary'}>
                    <Spinner data-icon="inline-start" />
                    {isDegraded ? 'Degraded' : 'Healthy'}
                </Badge>
            </p>
        </article>
    );
}
