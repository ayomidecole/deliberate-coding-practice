// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RefreshOrdersButton } from "./refresh-orders-button";

afterEach(cleanup);

describe("RefreshOrdersButton", () => {
  it("renders a semantic button without calling the callback", () => {
    const onRefresh = vi.fn();

    render(<RefreshOrdersButton onRefresh={onRefresh} />);

    const button = screen.getByRole("button", { name: "Refresh orders" });
    expect(button.getAttribute("type")).toBe("button");
    expect(onRefresh).not.toHaveBeenCalled();
  });

  it("calls the supplied callback once for each click", () => {
    const onRefresh = vi.fn();

    render(<RefreshOrdersButton onRefresh={onRefresh} />);

    const button = screen.getByRole("button", { name: "Refresh orders" });
    fireEvent.click(button);
    expect(onRefresh).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    expect(onRefresh).toHaveBeenCalledTimes(2);
  });
});
