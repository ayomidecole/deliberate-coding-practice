import { ServiceHealthSummary } from '../../components/services/service-health-summary';
import type { MonitoredService } from '../../domain/monitored-service';

export type ReviewServiceHealthFeatureProps = {
    readonly services: readonly MonitoredService[];
    readonly selectedServiceId: string;
};

export function ReviewServiceHealthFeature({
    services,
    selectedServiceId,
}: ReviewServiceHealthFeatureProps) {

  const selectedService = services.find(
    (service) => service.id === selectedServiceId,
  );
  return (
    <section className='feature-stack' aria-labelledby='service-health-heading'>
      <h2 id='service-health-heading'>Review service health</h2>
      {selectedService ? 
        <ServiceHealthSummary
        service={selectedService}
        /> :
      <p role='status'>Selected service unavailable</p>  
    }
      </section>
    );
}
