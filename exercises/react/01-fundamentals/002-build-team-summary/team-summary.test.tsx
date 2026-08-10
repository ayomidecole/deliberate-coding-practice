// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TeamSummary } from "./team-summary";

afterEach(cleanup);

describe("TeamSummary", () => {
  it("renders a platform team from props", () => {
    render(<TeamSummary teamName="Platform" memberCount={8} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Platform team" }),
    ).toBeTruthy();
    expect(screen.getByText("8 members")).toBeTruthy();
  });

  it("renders different team data without hardcoding", () => {
    render(<TeamSummary teamName="Design" memberCount={3} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Design team" }),
    ).toBeTruthy();
    expect(screen.getByText("3 members")).toBeTruthy();
  });
});
