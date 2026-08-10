import type { ChangeEventHandler } from "react";

export type CustomerNoteFieldProps = {
  readonly note: string;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export function CustomerNoteField({
  note,
  onChange,
}: CustomerNoteFieldProps) {
  return (
    <label>
      Customer note
      <input type="text" value={note} onChange={onChange} />
    </label>
  );
}
