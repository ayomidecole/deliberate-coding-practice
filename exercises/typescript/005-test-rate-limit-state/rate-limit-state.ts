export type RateLimitState = {
  readonly remainingRequests: number;
  readonly blocked: boolean;
};

export function getRateLimitState(
  limit: number,
  used: number,
): RateLimitState {
  const remainingRequests = limit - used;

  return {
    remainingRequests,
    blocked: remainingRequests === 0,
  };
}
