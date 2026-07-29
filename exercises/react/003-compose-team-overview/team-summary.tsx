export type TeamSummaryProps = {
  readonly teamName: string;
  readonly memberCount: number;
};

export function TeamSummary({
  teamName,
  memberCount,
}: TeamSummaryProps) {
  return (
    <header>
      <h2>{teamName} team</h2>
      <p>{memberCount} members</p>
    </header>
  );
}
