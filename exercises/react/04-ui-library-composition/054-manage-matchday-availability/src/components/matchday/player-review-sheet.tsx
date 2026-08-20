import type { MatchdayPlayer } from '../../domain/matchday-squad';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';

export type PlayerReviewSheetProps = {
  readonly player: MatchdayPlayer | null;
  readonly open: boolean;
  readonly onOpenChange: (nextOpen: boolean) => void;
  readonly onClearPlayer: () => void;
};

export function PlayerReviewSheet({
  player,
  open,
  onOpenChange,
  onClearPlayer,
}: PlayerReviewSheetProps) {
  if (player === null) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Review {player.displayName}</SheetTitle>
          <SheetDescription>
            Confirm the final medical decision for this player.
          </SheetDescription>
        </SheetHeader>
        <dl className="player-review-details">
          <dt>Shirt</dt>
          <dd>{player.shirtNumber}</dd>
          <dt>Position</dt>
          <dd>{player.position}</dd>
          <dt>Medical note</dt>
          <dd>{player.medicalNote}</dd>
        </dl>
        <SheetFooter>
          <Button type="button" onClick={onClearPlayer}>
            Clear to play
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
