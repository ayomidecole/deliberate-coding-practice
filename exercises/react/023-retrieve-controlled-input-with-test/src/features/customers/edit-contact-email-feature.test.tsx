// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { EditContactEmailFeature } from "./edit-contact-email-feature";

afterEach(cleanup);

describe("EditContactEmailFeature", () => {
  it("starts with an empty controlled field and initial guidance", () => {
    render(<EditContactEmailFeature />);

    const input = screen.getByRole("textbox", {
      name: "Contact email",
    }) as HTMLInputElement;

    expect(input.value).toBe("");
    expect(screen.getByText("No contact email entered.")).toBeTruthy();
  });
});
