export interface Invitee {
    readonly name: string;
    readonly email: string;
}

export const deduplicateInvitees = (
    invitees: readonly Invitee[],
): Invitee[] => {
    const resultList: Invitee[] = [];
    const normalizedEmails = new Set<string>();

    for (const invitee of invitees) {
        const normalizedEmail = invitee.email.trim().toLowerCase()
        if (!normalizedEmails.has(normalizedEmail)) {
            normalizedEmails.add(normalizedEmail)
            resultList.push(invitee)
        }
    }
    return resultList;
};
