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
  void player;
  void open;
  void onOpenChange;
  void onClearPlayer;
  void Button;
  void SheetContent;
  void SheetDescription;
  void SheetFooter;
  void SheetHeader;
  void SheetTitle;

  return <Sheet />;
}
