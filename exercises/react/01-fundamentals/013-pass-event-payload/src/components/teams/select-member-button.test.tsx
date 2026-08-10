// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SelectMemberButton } from "./select-member-button";

afterEach(cleanup);

describe("SelectMemberButton", () => {
  it("renders without selecting a member", () => {
    const onSelect = vi.fn();

    render(
      <SelectMemberButton
        memberId="member-7"
        displayName="Ava Stone"
        onSelect={onSelect}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Select Ava Stone",
    });
    expect(button.getAttribute("type")).toBe("button");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("sends the current member ID once per click", () => {
    const onSelect = vi.fn();

    render(
      <SelectMemberButton
        memberId="member-3"
        displayName="Noah Reed"
        onSelect={onSelect}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Select Noah Reed",
    });
    fireEvent.click(button);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("member-3");
  });
});
