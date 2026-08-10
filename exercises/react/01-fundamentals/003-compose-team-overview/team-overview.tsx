import { TeamSummary } from './team-summary';

export type TeamOverviewProps = {
    readonly teamName: string;
    readonly memberCount: number;
    readonly description: string;
};

export function TeamOverview({
    teamName,
    memberCount,
    description,
}: TeamOverviewProps) {
    return (
        <div>
            <TeamSummary teamName={teamName} memberCount={memberCount} />
            <p>{description}</p>
        </div>
    );
}
