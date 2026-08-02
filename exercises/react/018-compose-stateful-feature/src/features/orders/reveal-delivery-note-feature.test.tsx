// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RevealDeliveryNoteFeature } from "./reveal-delivery-note-feature";

afterEach(cleanup);

describe("RevealDeliveryNoteFeature", () => {
  it("starts with the feature's delivery note hidden", () => {
    const { container } = render(<RevealDeliveryNoteFeature />);

    const button = screen.getByRole("button", {
      name: "Reveal delivery note",
    });
    expect(button.getAttribute("type")).toBe("button");
    expect(container.querySelector("p")).toBeNull();
  });

  it("reveals the delivery note through the composed component", () => {
    render(<RevealDeliveryNoteFeature />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reveal delivery note",
      }),
    );

    expect(screen.getByText("Signature required at delivery.")).toBeTruthy();
  });
});
