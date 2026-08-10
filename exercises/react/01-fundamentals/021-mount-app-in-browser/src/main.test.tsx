// @vitest-environment jsdom

import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("browser entry", () => {
  it("mounts the application into the HTML root", async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await act(async () => {
      await import("./main");
    });

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Customer workspace",
      }),
    ).toBeTruthy();
  });
});
