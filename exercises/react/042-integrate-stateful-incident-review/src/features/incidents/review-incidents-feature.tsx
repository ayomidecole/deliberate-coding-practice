import { useState } from 'react';

import { IncidentReviewList } from '../../components/incidents/incident-review-list';
import type { Incident } from '../../domain/incident';

export type ReviewIncidentsFeatureProps = {
  readonly incidents: readonly Incident[];
};

export function ReviewIncidentsFeature({
  incidents,
}: ReviewIncidentsFeatureProps) {
  const [selectedIncidentId, setSelectedIncidentId] = useState('');

  const handleIncidentSelect = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
  };

  return (
    <section aria-labelledby="incident-review-heading">
      <h2 id="incident-review-heading">Incident review queue</h2>
      <IncidentReviewList
        incidents={incidents}
        onIncidentSelect={handleIncidentSelect}
      />
      <p>
        {selectedIncidentId === ''
          ? 'No incident selected.'
          : `Selected incident: ${selectedIncidentId}`}
      </p>
    </section>
  );
}
