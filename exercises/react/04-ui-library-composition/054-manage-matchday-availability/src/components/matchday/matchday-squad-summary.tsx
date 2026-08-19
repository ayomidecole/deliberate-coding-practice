import type { MatchdaySquad } from '../../domain/matchday-squad';
import { Badge } from '../ui/badge';

export type MatchdaySquadSummaryProps = {
  readonly squad: MatchdaySquad;
  readonly clearedCount: number;
};

export function MatchdaySquadSummary({
  squad,
  clearedCount,
}: MatchdaySquadSummaryProps) {
  void squad;
  void clearedCount;
  void Badge;

  return <header className="fixture-summary" />;
}
