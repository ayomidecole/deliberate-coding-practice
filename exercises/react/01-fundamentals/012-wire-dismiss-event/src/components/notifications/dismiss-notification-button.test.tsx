// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DismissNotificationButton } from "./dismiss-notification-button";

afterEach(cleanup);

describe("DismissNotificationButton", () => {
  it("renders a semantic button without calling the callback", () => {
    const onDismiss = vi.fn();

    render(<DismissNotificationButton onDismiss={onDismiss} />);

    const button = screen.getByRole("button", {
      name: "Dismiss notification",
    });
    expect(button.getAttribute("type")).toBe("button");
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("calls the supplied callback once for each click", () => {
    const onDismiss = vi.fn();

    render(<DismissNotificationButton onDismiss={onDismiss} />);

    const button = screen.getByRole("button", {
      name: "Dismiss notification",
    });
    fireEvent.click(button);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });
});
