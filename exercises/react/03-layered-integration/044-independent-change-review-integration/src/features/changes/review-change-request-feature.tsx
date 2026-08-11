import { type ChangeEvent, useState } from 'react';

import { ChangeReviewPanel } from '../../components/changes/change-review-panel';
import type { ChangeRequest } from '../../domain/change-request';

export type ReviewChangeRequestFeatureProps = {
  readonly request: ChangeRequest;
};

export function ReviewChangeRequestFeature({
  request,
}: ReviewChangeRequestFeatureProps) {
  const [reviewNote, setReviewNote] = useState('');

  const handleReviewNoteChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setReviewNote(event.currentTarget.value);
  };

  const handleClearReviewNote = () => {
    setReviewNote('');
  };

  const clearDisabled = reviewNote === '';

  return (
    <section aria-labelledby="review-change-request-heading">
      <h2 id="review-change-request-heading">Review change request</h2>
      <ChangeReviewPanel
        request={request}
        reviewNote={reviewNote}
        clearDisabled={clearDisabled}
        onReviewNoteChange={handleReviewNoteChange}
        onClearReviewNote={handleClearReviewNote}
      />
    </section>
  );
}
