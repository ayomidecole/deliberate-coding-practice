export function readObject(
  value: unknown,
  fieldName: string,
): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return value as Record<string, unknown>;
}

export function readString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  return value;
}

export function readLiteral<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fieldName: string,
): T {
  if (
    typeof value !== 'string' ||
    !allowedValues.includes(value as T)
  ) {
    throw new Error(`${fieldName} has an unsupported value`);
  }

  return value as T;
}

export function readArray<T>(
  value: unknown,
  fieldName: string,
  decodeItem: (item: unknown, index: number) => T,
): readonly T[] {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value.map(decodeItem);
}
