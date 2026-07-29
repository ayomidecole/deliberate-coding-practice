export type TeamSummaryProps = {
    readonly teamName: string;
    readonly memberCount: number;
};

export function TeamSummary({ teamName, memberCount }: TeamSummaryProps) {
    return (
        <div>
            <h2>{teamName} team</h2>
            <p>{memberCount} members</p>
        </div>
    );
}
