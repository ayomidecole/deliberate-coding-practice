// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CancelOrderButton } from "./cancel-order-button";

afterEach(cleanup);

describe("CancelOrderButton", () => {
  it("shows the order number without requesting cancellation", () => {
    const onCancel = vi.fn();

    render(
      <CancelOrderButton
        orderId="order-db-17"
        orderNumber="A-104"
        onCancel={onCancel}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Cancel order A-104",
    });
    expect(button.getAttribute("type")).toBe("button");
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("sends the internal order ID once per click", () => {
    const onCancel = vi.fn();

    render(
      <CancelOrderButton
        orderId="order-db-42"
        orderNumber="B-208"
        onCancel={onCancel}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel order B-208",
      }),
    );

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledWith("order-db-42");
  });
});
