// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { FirstStepButton } from "./first-step-button";

afterEach(cleanup);

describe("FirstStepButton", () => {
  it("renders the initial completed-step count", () => {
    render(<FirstStepButton />);

    const button = screen.getByRole("button", {
      name: "Completed steps: 0",
    });
    expect(button.getAttribute("type")).toBe("button");
  });

  it("renders the stored completed-step count after a click", () => {
    render(<FirstStepButton />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Completed steps: 0",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Completed steps: 1",
      }),
    ).toBeTruthy();
  });
});
