// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ValidateShipmentReferenceFeature } from "./validate-shipment-reference-feature";

afterEach(cleanup);

describe("ValidateShipmentReferenceFeature", () => {
  it("starts with an invalid empty reference", () => {
    render(<ValidateShipmentReferenceFeature />);

    const input = screen.getByRole("textbox", {
      name: "Shipment reference",
    }) as HTMLInputElement;

    expect(input.value).toBe("");
    expect(
      screen.getByText("Shipment reference must contain 6 to 12 characters."),
    ).toBeTruthy();
    expect(screen.queryByText("Shipment reference is valid.")).toBeNull();
  });

  it("preserves raw input while validating its normalized value", () => {
    render(<ValidateShipmentReferenceFeature />);

    const input = screen.getByRole("textbox", {
      name: "Shipment reference",
    }) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        value: "  ABC123  ",
      },
    });

    expect(input.value).toBe("  ABC123  ");
    expect(screen.getByText("Shipment reference is valid.")).toBeTruthy();
    expect(
      screen.queryByText("Shipment reference must contain 6 to 12 characters."),
    ).toBeNull();
  });
});
