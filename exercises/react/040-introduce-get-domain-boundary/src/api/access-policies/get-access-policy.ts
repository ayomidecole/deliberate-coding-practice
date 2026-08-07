import { AccessPolicy } from "../../domain/access-policy";
import type { HttpClient } from "../http-client";

export async function getAccessPolicy(
  httpClient: HttpClient,
  policyId: string,
): Promise<AccessPolicy> {
  throw new Error("getAccessPolicy not implemented");
}
