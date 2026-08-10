// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { InventoryStatus } from "./inventory-status";

afterEach(cleanup);

describe("InventoryStatus", () => {
  it("renders sold-out status when inventory is empty", () => {
    render(
      <InventoryStatus productName="Coffee Beans" availableUnits={0} />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Coffee Beans",
      }),
    ).toBeTruthy();
    expect(screen.getByText("Sold out")).toBeTruthy();
    expect(screen.queryByText("0 units available")).toBeNull();
  });

  it("renders the available count when inventory is positive", () => {
    render(
      <InventoryStatus productName="Green Tea" availableUnits={7} />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Green Tea",
      }),
    ).toBeTruthy();
    expect(screen.getByText("7 units available")).toBeTruthy();
    expect(screen.queryByText("Sold out")).toBeNull();
  });
});
