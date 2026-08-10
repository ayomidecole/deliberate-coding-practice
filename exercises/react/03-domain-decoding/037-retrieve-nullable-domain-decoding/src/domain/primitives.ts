export type UnknownRecord = Readonly<Record<string, unknown>>;

export function readObject(value: unknown, label: string): UnknownRecord {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error(`${label} must be an object`);
    }

    return value as UnknownRecord;
}

export function readString(value: unknown, fieldName: string): string {
    if (typeof value !== 'string') {
        throw new Error(`${fieldName} must be a string`);
    }

    return value;
}

export function readNumber(value: unknown, fieldName: string): number {
    if (typeof value !== 'number') {
        throw new Error(`${fieldName} must be a number`);
    }

    return value;
}

export function readNullableString(
    value: unknown,
    fieldName: string,
): string | null {
    if (typeof value === 'string') {
        return value;
    }

    if (value === null) {
        return null;
    }

    throw new Error(`${fieldName} must be a string or null`);
}
