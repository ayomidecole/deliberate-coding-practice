import { describe, expect, it } from "vitest";

import type { CustomerApiRecord } from "../types/customer-api";
import { Customer } from "./customer";

const CUSTOMER_API_RECORD: CustomerApiRecord = {
  customer_id: "customer-440",
  display_name: "Northwind Retail",
  risk_score: 7,
};

describe("Customer", () => {
  it("constructs a trusted domain model from a valid API record", () => {
    const customer = new Customer(CUSTOMER_API_RECORD);

    expect(customer.id).toBe("customer-440");
    expect(customer.riskScore).toBe(7);
    expect(customer.displayName).toBe("Northwind Retail");
  });

  it("rejects a non-number risk score", () => {
    expect(
      () => new Customer({ ...CUSTOMER_API_RECORD, risk_score: "high" }),
    ).toThrow("risk_score must be a number");
  });
});
