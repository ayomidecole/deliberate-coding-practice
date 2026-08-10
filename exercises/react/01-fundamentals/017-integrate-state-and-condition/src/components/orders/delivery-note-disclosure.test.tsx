// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { DeliveryNoteDisclosure } from "./delivery-note-disclosure";

afterEach(cleanup);

describe("DeliveryNoteDisclosure", () => {
  it("hides the delivery note initially", () => {
    const { container } = render(<DeliveryNoteDisclosure />);

    const button = screen.getByRole("button", {
      name: "Reveal delivery note",
    });
    expect(button.getAttribute("type")).toBe("button");
    expect(screen.queryByText("Signature required at delivery.")).toBeNull();
    expect(container.querySelector("p")).toBeNull();
  });

  it("reveals the delivery note after a click", () => {
    render(<DeliveryNoteDisclosure />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reveal delivery note",
      }),
    );

    const note = screen.getByText("Signature required at delivery.");
    expect(note.tagName).toBe("P");
  });
});
