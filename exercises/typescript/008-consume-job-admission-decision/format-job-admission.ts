import type { JobAdmissionDecision } from './job-admission-decision';

function formatAccepted(resultingJobs: number): string {
    return `Accepted: ${resultingJobs} jobs running.`;
}

function formatRejected(reason: 'capacity-exceeded'): string {
    return `Rejected: ${reason}.`;
}

export function formatJobAdmission(decision: JobAdmissionDecision): string {
    throw new Error('Not implemented');
}
