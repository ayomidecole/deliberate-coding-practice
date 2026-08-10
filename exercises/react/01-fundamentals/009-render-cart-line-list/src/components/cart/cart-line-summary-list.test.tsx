// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CartLineSummaryList } from "./cart-line-summary-list";

afterEach(cleanup);

describe("CartLineSummaryList", () => {
  it("renders every cart summary as a list item in input order", () => {
    render(
      <CartLineSummaryList
        summaries={[
          { id: "keyboard", label: "2 x Keyboard", totalCents: 9000 },
          { id: "mouse", label: "3 x Mouse", totalCents: 7500 },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Cart summary",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("list")).toBeTruthy();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]?.textContent).toBe("2 x Keyboard: 9000 cents");
    expect(items[1]?.textContent).toBe("3 x Mouse: 7500 cents");
  });

  it("renders an empty semantic list for empty input", () => {
    render(<CartLineSummaryList summaries={[]} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Cart summary",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("list")).toBeTruthy();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
