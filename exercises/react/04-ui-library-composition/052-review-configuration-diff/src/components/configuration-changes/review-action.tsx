import { Button } from '../ui/button';

export type ReviewActionProps = {
  readonly isReviewed: boolean;
  readonly onReview: () => void;
};

export function ReviewAction({ isReviewed, onReview }: ReviewActionProps) {
  return (
    <Button type="button" disabled={isReviewed} onClick={onReview}>
      {isReviewed ? 'Change reviewed' : 'Mark as reviewed'}
    </Button>
  );
}
