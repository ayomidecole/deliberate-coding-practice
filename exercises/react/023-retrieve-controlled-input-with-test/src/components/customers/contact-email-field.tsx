import type { ChangeEventHandler } from "react";

export type ContactEmailFieldProps = {
  readonly email: string;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export function ContactEmailField({
  email,
  onChange,
}: ContactEmailFieldProps) {
  return (
    <label>
      Contact email
      <input type="email" value={email} onChange={onChange} />
    </label>
  );
}
