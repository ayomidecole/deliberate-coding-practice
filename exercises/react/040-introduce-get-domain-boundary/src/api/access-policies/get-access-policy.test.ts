import { describe, expect, it } from "vitest";

import { AccessPolicy } from "../../domain/access-policy";
import type { AccessPolicyApiRecord } from "../../types/access-policy-api";
import type { HttpClient } from "../http-client";
import { getAccessPolicy } from "./get-access-policy";

const ACCESS_POLICY_API_RECORD: AccessPolicyApiRecord = {
  policy_id: "policy-204",
  policy_name: "Production deployment",
  allowed_regions: ["us-east-1", "us-west-2"],
  required_roles: ["release-manager", "service-owner"],
  revision: 3,
};

describe("getAccessPolicy", () => {
  it("requests and decodes an access policy", async () => {
    const requestedPaths: string[] = [];
    const httpClient: HttpClient = {
      get: async (path) => {
        requestedPaths.push(path);
        return ACCESS_POLICY_API_RECORD;
      },
    };

    const policy = await getAccessPolicy(httpClient, "policy-204");

    expect(policy).toBeInstanceOf(AccessPolicy);
    expect(policy.id).toBe("policy-204");
    expect(policy.allowedRegions).toEqual(["us-east-1", "us-west-2"]);
    expect(policy.requiredRoles).toEqual(["release-manager", "service-owner"]);
  });

  it("propagates transport rejection", async () => {
    const httpClient: HttpClient = {
      get: async () => {
        throw new Error("Network unavailable");
      },
    };

    await expect(getAccessPolicy(httpClient, "policy-204")).rejects.toThrow(
      "Network unavailable",
    );
  });

  it("rejects malformed response data through the domain boundary", async () => {
    const httpClient: HttpClient = {
      get: async () => ({
        ...ACCESS_POLICY_API_RECORD,
        required_roles: ["release-manager", false],
      }),
    };

    await expect(getAccessPolicy(httpClient, "policy-204")).rejects.toThrow(
      "required_roles[1] must be a string",
    );
  });
});
