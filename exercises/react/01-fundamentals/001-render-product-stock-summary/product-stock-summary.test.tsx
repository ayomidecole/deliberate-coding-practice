// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProductStockSummary } from "./product-stock-summary";

afterEach(cleanup);

describe("ProductStockSummary", () => {
  it("renders coffee stock information from props", () => {
    render(
      <ProductStockSummary
        productName="Coffee Beans"
        availableUnits={7}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Coffee Beans" }),
    ).toBeTruthy();
    expect(screen.getByText("7 units available")).toBeTruthy();
  });

  it("renders a different product without hardcoded content", () => {
    render(
      <ProductStockSummary
        productName="Green Tea"
        availableUnits={2}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Green Tea" }),
    ).toBeTruthy();
    expect(screen.getByText("2 units available")).toBeTruthy();
  });
});
