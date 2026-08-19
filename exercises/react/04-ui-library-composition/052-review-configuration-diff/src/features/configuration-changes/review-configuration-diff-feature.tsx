import { useState } from 'react';

import { ConfigurationChangeSummary } from '../../components/configuration-changes/configuration-change-summary';
import { ConfigurationDiffViewer } from '../../components/configuration-changes/configuration-diff-viewer';
import { DiffModeControl } from '../../components/configuration-changes/diff-mode-control';
import type { DiffViewMode } from '../../components/configuration-changes/diff-view-mode';
import { ReviewAction } from '../../components/configuration-changes/review-action';
import type { ConfigurationChange } from '../../domain/configuration-change';


export type ReviewConfigurationDiffFeatureProps = {
  readonly change: ConfigurationChange;
};

export function ReviewConfigurationDiffFeature({
  change,
}: ReviewConfigurationDiffFeatureProps) {
  const [viewMode, setViewMode] = useState<DiffViewMode>('split');
  const [isReviewed, setIsReviewed] = useState(
    change.reviewStatus === 'reviewed',
  );

  const handleViewModeChange = (nextMode: DiffViewMode) => {
    setViewMode(nextMode);
  };

  const handleReview = () => {
    setIsReviewed(true);
  };

  return (
    <section
      className="feature-stack"
      aria-labelledby="configuration-review-heading"
    >
      <h2 id="configuration-review-heading">Review configuration change</h2>
      <ConfigurationChangeSummary change={change} isReviewed={isReviewed} />
      <div className="diff-toolbar">
        <DiffModeControl value={viewMode} onValueChange={handleViewModeChange} />
        <ReviewAction isReviewed={isReviewed} onReview={handleReview} />
      </div>
      <ConfigurationDiffViewer change={change} viewMode={viewMode} />
    </section>
  );
}
