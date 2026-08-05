export function canAcceptJobs(
    currentJobs: number,
    incomingJobs: number,
    maxConcurrentJobs: number,
): boolean {
    return incomingJobs <= maxConcurrentJobs - currentJobs;
}
