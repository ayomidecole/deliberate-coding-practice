import type { ChangeEventHandler } from 'react';

import type { ChangeRequest } from '../../domain/change-request';

export type ChangeReviewPanelProps = {
  readonly request: ChangeRequest;
  readonly reviewNote: string;
  readonly clearDisabled: boolean;
  readonly onReviewNoteChange: ChangeEventHandler<HTMLInputElement>;
  readonly onClearReviewNote: () => void;
};

export function ChangeReviewPanel({ request, reviewNote, clearDisabled, onReviewNoteChange, onClearReviewNote }: ChangeReviewPanelProps) {
  const headingId = `change-review-${request.id}`;
  return (
    <article aria-labelledby={headingId}>
      <h3 id={headingId}>{request.summary}</h3>
      <p>Service: {request.serviceName}</p>
      <p>Risk score: {request.riskScore}</p>
      <label>
        Reviewer note
        <input
          type="text"
          value={reviewNote}
          onChange={onReviewNoteChange}
        />
      </label>
      <button
        type="button"
        disabled={clearDisabled}
        onClick={onClearReviewNote}
      >
        Clear note
      </button>
    </article>
  );
}
