export type RestoreInstructionButtonProps = {
  readonly disabled: boolean;
  readonly onRestore: () => void;
};

export function RestoreInstructionButton({
  disabled,
  onRestore,
}: RestoreInstructionButtonProps) {
  return (
    <button type="button" disabled={disabled} onClick={onRestore}>
      Restore original
    </button>
  );
}
