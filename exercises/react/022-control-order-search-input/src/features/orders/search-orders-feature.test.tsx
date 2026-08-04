// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SearchOrdersFeature } from "./search-orders-feature";

afterEach(cleanup);

describe("SearchOrdersFeature", () => {
  it("starts with an empty controlled field and its initial guidance", () => {
    render(<SearchOrdersFeature />);

    const input = screen.getByRole("searchbox", {
      name: "Search orders",
    }) as HTMLInputElement;

    expect(input.value).toBe("");
    expect(screen.getByText("Enter an order number.")).toBeTruthy();
  });

  it("stores an input edit and returns it through the component", () => {
    render(<SearchOrdersFeature />);

    const input = screen.getByRole("searchbox", {
      name: "Search orders",
    }) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        value: "ORD-2048",
      },
    });

    expect(input.value).toBe("ORD-2048");
    expect(screen.getByText("Searching for: ORD-2048")).toBeTruthy();
    expect(screen.queryByText("Enter an order number.")).toBeNull();
  });
});
