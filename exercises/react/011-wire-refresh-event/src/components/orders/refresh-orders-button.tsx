export type RefreshOrdersButtonProps = {
  readonly onRefresh: () => void;
};

export function RefreshOrdersButton({
  onRefresh,
}: RefreshOrdersButtonProps) {
  return <button type="button" onClick={onRefresh}>Refresh orders</button>;
}
