import { describe, expect, it } from 'vitest';
import { deduplicateInvitees, type Invitee } from './deduplicate-invitees';

const duplicateInvitees: readonly Invitee[] = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
    },
    {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
    },
    {
        name: 'Johnny Doe',
        email: 'john.doe@example.com',
    },
    {
        name: 'Janey Deo',
        email: 'jane.doe@example.com',
    },
];

const uniqueInvitees: readonly Invitee[] = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
    },
    {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
    },
];

const duplicateInviteesWithCapitalizationAndWhitespace: readonly Invitee[] = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
    },
    {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
    },
    {
        name: 'Johnny Doe',
        email: '  john.DOE@example.COM  ',
    },
    {
        name: 'Janey Deo',
        email: '  Jane.DOE@example.COM   ',
    }
]

const emptyInvitees: readonly Invitee[] = [];

describe('deduplicateInvitees', () => {
    it('empty input returns an empty array', () => {
        const result = deduplicateInvitees(emptyInvitees)

        expect(result).toEqual([])
        expect(result).not.toBe(emptyInvitees)
    })

    it('multiple unique invitees are returned in the same order', () => {
        const result = deduplicateInvitees(uniqueInvitees)

        expect(result).toEqual(uniqueInvitees)
        expect(result).not.toBe(uniqueInvitees)
    })

    it('removes duplicates while preserving the first invitees and their order', () => {
        const result = deduplicateInvitees(duplicateInvitees)

        expect(result).toEqual([{
            name: 'John Doe',
            email: 'john.doe@example.com',
        }, {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
        }])
        expect(result).not.toBe(duplicateInvitees)
    })

    it('duplicates with capitalization or whitespace are correctly deduplicated', () => {
        const result = deduplicateInvitees(duplicateInviteesWithCapitalizationAndWhitespace)

        expect(result).toEqual([{
            name: 'John Doe',
            email: 'john.doe@example.com',
        }, {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
        }])
        expect(result).not.toBe(duplicateInviteesWithCapitalizationAndWhitespace)
    })

    it('does not mutate the input array or its invitees', () => {
        const original = structuredClone(duplicateInviteesWithCapitalizationAndWhitespace)

        deduplicateInvitees(duplicateInviteesWithCapitalizationAndWhitespace)

        expect(duplicateInviteesWithCapitalizationAndWhitespace).toEqual(original)
    })
})
