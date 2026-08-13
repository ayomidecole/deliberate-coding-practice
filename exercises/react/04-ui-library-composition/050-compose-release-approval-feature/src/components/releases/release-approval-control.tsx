import { Button } from '../ui/button';

export type ReleaseApprovalControlProps = {
  readonly isApproved: boolean;
  readonly canApprove: boolean;
  readonly onApprove: () => void;
};

export function ReleaseApprovalControl({
  isApproved,
  canApprove,
  onApprove,
}: ReleaseApprovalControlProps) {
  return (
    <Button type="button" disabled={!canApprove} onClick={onApprove}>
      {isApproved ? 'Release approved' : 'Approve release'}
    </Button>
  );
}
