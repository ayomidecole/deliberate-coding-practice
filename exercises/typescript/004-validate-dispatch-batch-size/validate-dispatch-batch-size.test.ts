import { describe, expect, it } from "vitest";

import { isValidDispatchBatchSize } from "./validate-dispatch-batch-size";

describe("isValidDispatchBatchSize", () => {
  it.each([1, 25, 100])("accepts the valid batch size %s", (batchSize) => {
    expect(isValidDispatchBatchSize(batchSize)).toBe(true);
  });

  it.each([0, -1, 1.5, 100.5, 101, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects the invalid batch size %s",
    (batchSize) => {
      expect(isValidDispatchBatchSize(batchSize)).toBe(false);
    },
  );
});
