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
    return (
        <header className="fixture-summary">
            <p>{squad.competition}</p>
            <h3>
                {squad.teamName} vs {squad.opponentName}
            </h3>
            <p>{squad.kickoffLabel}</p>
            <Badge
                variant={
                    clearedCount === squad.players.length
                        ? 'default'
                        : 'secondary'
                }
            >
                {clearedCount} of {squad.players.length} players cleared
            </Badge>
        </header>
    );
}
