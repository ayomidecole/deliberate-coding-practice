import { describe, expect, it } from "vitest";

import type { DeploymentApiRecord } from "../types/deployment-api";
import { Deployment } from "./deployment";

const DEPLOYMENT_API_RECORD: DeploymentApiRecord = {
  deployment_id: "deployment-901",
  environment: "production",
  warning_codes: ["LATE_SCAN", "ADDRESS_CHECK"],
  duration_minutes: 18,
};

describe("Deployment", () => {
  it("constructs a deployment with validated warning codes", () => {
    const deployment = new Deployment(DEPLOYMENT_API_RECORD);

    expect(deployment.id).toBe("deployment-901");
    expect(deployment.environment).toBe("production");
    expect(deployment.warningCodes).toEqual(["LATE_SCAN", "ADDRESS_CHECK"]);
    expect(deployment.durationMinutes).toBe(18);
  });

  it("preserves an empty warning-code collection", () => {
    const deployment = new Deployment({
      ...DEPLOYMENT_API_RECORD,
      warning_codes: [],
    });

    expect(deployment.warningCodes).toEqual([]);
  });

  it("does not retain the raw array reference", () => {
    const rawWarningCodes: unknown[] = ["LATE_SCAN"];
    const deployment = new Deployment({
      ...DEPLOYMENT_API_RECORD,
      warning_codes: rawWarningCodes,
    });

    rawWarningCodes.push("ADDRESS_CHECK");

    expect(deployment.warningCodes).toEqual(["LATE_SCAN"]);
  });

  it("rejects a non-array warning-code value", () => {
    expect(
      () =>
        new Deployment({
          ...DEPLOYMENT_API_RECORD,
          warning_codes: "LATE_SCAN",
        }),
    ).toThrow("warning_codes must be an array");
  });

  it("rejects a non-string warning-code value", () => {
    expect(
      () =>
        new Deployment({
          ...DEPLOYMENT_API_RECORD,
          warning_codes: ["LATE_SCAN", 404],
        }),
    ).toThrow("warning_codes[1] must be a string");
  });
});
