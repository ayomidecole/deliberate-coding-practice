import type { ChangeEventHandler } from "react";

export type OrderSearchFieldProps = {
  readonly searchTerm: string;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export function OrderSearchField({
  searchTerm,
  onChange,
}: OrderSearchFieldProps) {
  return (
    <label>
      Search orders
      <input type="search" value={searchTerm} onChange={onChange} />
    </label>
  );
}
