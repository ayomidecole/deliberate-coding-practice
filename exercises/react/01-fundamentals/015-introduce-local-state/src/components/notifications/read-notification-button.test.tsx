// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ReadNotificationButton } from "./read-notification-button";

afterEach(cleanup);

describe("ReadNotificationButton", () => {
  it("starts with the unread action", () => {
    render(<ReadNotificationButton />);

    const button = screen.getByRole("button", {
      name: "Mark notification as read",
    });
    expect(button.getAttribute("type")).toBe("button");
  });

  it("shows the remembered read state after a click", () => {
    render(<ReadNotificationButton />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Mark notification as read",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Notification read",
      }),
    ).toBeTruthy();
  });
});
