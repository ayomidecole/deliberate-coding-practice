// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TeamMemberList } from "./team-member-list";

afterEach(cleanup);

describe("TeamMemberList", () => {
  it("renders every member as a list item in input order", () => {
    render(
      <TeamMemberList
        members={[
          { id: "member-7", displayName: "Ava Stone", role: "Designer" },
          { id: "member-3", displayName: "Noah Reed", role: "Engineer" },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Team members",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("list")).toBeTruthy();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]?.textContent).toBe("Ava Stone: Designer");
    expect(items[1]?.textContent).toBe("Noah Reed: Engineer");
  });

  it("renders an empty semantic list for empty input", () => {
    render(<TeamMemberList members={[]} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Team members",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("list")).toBeTruthy();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
