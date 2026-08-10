export type SelectMemberButtonProps = {
  readonly memberId: string;
  readonly displayName: string;
  readonly onSelect: (memberId: string) => void;
};

export function SelectMemberButton({
  memberId,
  displayName,
  onSelect,
}: SelectMemberButtonProps) {
  function handleSelect() {
    onSelect(memberId)
  }

  return <button type="button" onClick={handleSelect}>Select {displayName}</button>
}
