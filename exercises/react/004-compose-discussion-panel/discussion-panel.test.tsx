// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { DiscussionPanel } from "./discussion-panel";

afterEach(cleanup);

describe("DiscussionPanel", () => {
  it("composes an architecture discussion from props", () => {
    render(
      <DiscussionPanel
        title="Frontend architecture"
        commentCount={12}
        authorName="Mina"
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Frontend architecture",
      }),
    ).toBeTruthy();
    expect(screen.getByText("12 comments")).toBeTruthy();
    expect(screen.getByText("Started by Mina")).toBeTruthy();
  });

  it("renders different discussion data without hardcoding", () => {
    render(
      <DiscussionPanel
        title="Testing strategy"
        commentCount={4}
        authorName="Luis"
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Testing strategy",
      }),
    ).toBeTruthy();
    expect(screen.getByText("4 comments")).toBeTruthy();
    expect(screen.getByText("Started by Luis")).toBeTruthy();
  });
});
