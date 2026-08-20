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

function availabilityBadge(availability: PlayerAvailability): {
  readonly label: string;
  readonly variant: 'default' | 'secondary' | 'destructive';
} {
  switch (availability) {
    case 'cleared':
      return { label: 'Cleared', variant: 'default' };
    case 'review_required':
      return { label: 'Review required', variant: 'secondary' };
    case 'unavailable':
      return { label: 'Unavailable', variant: 'destructive' };
  }
}

export function PlayerAvailabilityTable({
  rows,
  onReviewPlayer,
}: PlayerAvailabilityTableProps) {
  return (
    <Table aria-label="Player availability">
      <TableCaption>Matchday player availability</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Shirt</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ player, availability }) => {
          const badge = availabilityBadge(availability);

          return (
            <TableRow key={player.id}>
              <TableCell>{player.displayName}</TableCell>
              <TableCell>{player.shirtNumber}</TableCell>
              <TableCell>{player.position}</TableCell>
              <TableCell>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </TableCell>
              <TableCell>
                {availability === 'review_required' ? (
                  <Button
                    variant="outline"
                    onClick={() => onReviewPlayer(player.id)}
                  >
                    Review {player.displayName}
                  </Button>
                ) : (
                  '—'
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
