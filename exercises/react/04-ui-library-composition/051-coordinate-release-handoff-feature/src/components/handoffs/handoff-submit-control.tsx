import { Button } from '../ui/button';

export type HandoffSubmitControlProps = {
  readonly isSent: boolean;
  readonly canSend: boolean;
  readonly onSend: () => void;
};

export function HandoffSubmitControl({
  isSent,
  canSend,
  onSend,
}: HandoffSubmitControlProps) {
  return (
    <Button type="button" disabled={!canSend} onClick={onSend}>
      {isSent ? 'Handoff sent' : 'Send handoff'}
    </Button>
  );
}
