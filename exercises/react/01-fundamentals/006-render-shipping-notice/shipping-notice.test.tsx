// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ShippingNotice } from "./shipping-notice";

afterEach(cleanup);

describe("ShippingNotice", () => {
  it("renders the delayed state", () => {
    render(<ShippingNotice orderNumber="A-104" isDelayed={true} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Order A-104",
      }),
    ).toBeTruthy();
    expect(screen.getByText("Delivery delayed")).toBeTruthy();
    expect(screen.queryByText("Delivery on schedule")).toBeNull();
  });

  it("renders the on-schedule state", () => {
    render(<ShippingNotice orderNumber="B-205" isDelayed={false} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Order B-205",
      }),
    ).toBeTruthy();
    expect(screen.getByText("Delivery on schedule")).toBeTruthy();
    expect(screen.queryByText("Delivery delayed")).toBeNull();
  });
});
