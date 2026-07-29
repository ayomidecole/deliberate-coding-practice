export type DiscussionSummaryProps = {
  readonly title: string;
  readonly commentCount: number;
};

export function DiscussionSummary({
  title,
  commentCount,
}: DiscussionSummaryProps) {
  return (
    <header>
      <h2>{title}</h2>
      <p>{commentCount} comments</p>
    </header>
  );
}
