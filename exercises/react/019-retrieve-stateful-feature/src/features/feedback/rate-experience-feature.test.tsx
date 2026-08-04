// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RateExperienceFeature } from "./rate-experience-feature";

afterEach(cleanup);

describe("RateExperienceFeature", () => {
  it("starts with no rating selected", () => {
    render(<RateExperienceFeature />);

    expect(screen.getByText("Current rating: 0")).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Rate 1",
      }).getAttribute("type"),
    ).toBe("button");
    expect(
      screen.getByRole("button", {
        name: "Rate 2",
      }).getAttribute("type"),
    ).toBe("button");
  });

  it("stores each rating reported by the controlled component", () => {
    render(<RateExperienceFeature />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Rate 2",
      }),
    );
    expect(screen.getByText("Current rating: 2")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Rate 1",
      }),
    );
    expect(screen.getByText("Current rating: 1")).toBeTruthy();
  });
});
