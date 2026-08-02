export type DeliveryNoteDisclosureProps = {
  readonly isRevealed: boolean;
  readonly onReveal: () => void;
};

export function DeliveryNoteDisclosure({
  isRevealed,
  onReveal,
}: DeliveryNoteDisclosureProps) {
  return (
    <div>
      <button type="button" onClick={onReveal}>
        Reveal delivery note
      </button>
      {isRevealed ? <p>Signature required at delivery.</p> : null}
    </div>
  );
}
