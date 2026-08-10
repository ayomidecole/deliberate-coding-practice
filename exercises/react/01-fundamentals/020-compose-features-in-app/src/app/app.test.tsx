// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "./app";

afterEach(cleanup);

describe("App", () => {
  it("composes both features under the app heading", () => {
    const { container } = render(<App />);

    expect(container.querySelector("main")).not.toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Customer workspace",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Reveal delivery note",
      }),
    ).toBeTruthy();
    expect(screen.getByText("Current rating: 0")).toBeTruthy();
  });

  it("preserves each feature's independent behavior", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reveal delivery note",
      }),
    );
    expect(screen.getByText("Signature required at delivery.")).toBeTruthy();
    expect(screen.getByText("Current rating: 0")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Rate 2",
      }),
    );
    expect(screen.getByText("Current rating: 2")).toBeTruthy();
    expect(screen.getByText("Signature required at delivery.")).toBeTruthy();
  });
});
