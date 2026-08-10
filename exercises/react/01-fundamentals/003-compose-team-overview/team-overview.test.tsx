// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TeamOverview } from "./team-overview";

afterEach(cleanup);

describe("TeamOverview", () => {
  it("composes a platform overview from parent props", () => {
    render(
      <TeamOverview
        teamName="Platform"
        memberCount={8}
        description="Builds shared developer infrastructure."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Platform team" }),
    ).toBeTruthy();
    expect(screen.getByText("8 members")).toBeTruthy();
    expect(
      screen.getByText("Builds shared developer infrastructure."),
    ).toBeTruthy();
  });

  it("forwards different team data without hardcoding", () => {
    render(
      <TeamOverview
        teamName="Design"
        memberCount={3}
        description="Owns the product experience."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Design team" }),
    ).toBeTruthy();
    expect(screen.getByText("3 members")).toBeTruthy();
    expect(screen.getByText("Owns the product experience.")).toBeTruthy();
  });
});
