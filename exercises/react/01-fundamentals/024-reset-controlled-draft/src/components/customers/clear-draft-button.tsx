export type ClearDraftButtonProps = {
  readonly disabled: boolean;
  readonly onClear: () => void;
};

export function ClearDraftButton({
  disabled,
  onClear,
}: ClearDraftButtonProps) {
  return (
    <button type="button" disabled={disabled} onClick={onClear}>
      Clear draft
    </button>
  );
}
