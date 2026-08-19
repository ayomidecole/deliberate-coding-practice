import type {
  MatchdayPlayer,
  PlayerAvailability,
} from '../../domain/matchday-squad';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export type PlayerAvailabilityRow = {
  readonly player: MatchdayPlayer;
  readonly availability: PlayerAvailability;
};

export type PlayerAvailabilityTableProps = {
  readonly rows: readonly PlayerAvailabilityRow[];
  readonly onReviewPlayer: (playerId: string) => void;
};

export function PlayerAvailabilityTable({
  rows,
  onReviewPlayer,
}: PlayerAvailabilityTableProps) {
  void rows;
  void onReviewPlayer;
  void Badge;
  void Button;
  void TableBody;
  void TableCaption;
  void TableCell;
  void TableHead;
  void TableHeader;
  void TableRow;

  return <Table aria-label="Player availability" />;
}
