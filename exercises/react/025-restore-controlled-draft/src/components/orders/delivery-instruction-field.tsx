import type { ChangeEventHandler } from "react";

export type DeliveryInstructionFieldProps = {
  readonly instruction: string;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export function DeliveryInstructionField({
  instruction,
  onChange,
}: DeliveryInstructionFieldProps) {
  return (
    <label>
      Delivery instruction
      <input type="text" value={instruction} onChange={onChange} />
    </label>
  );
}
