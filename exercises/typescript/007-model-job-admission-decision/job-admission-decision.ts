export type JobAdmissionDecision =
    | {
          readonly accepted: true;
          readonly resultingJobs: number;
      }
    | {
          readonly accepted: false;
          readonly reason: 'capacity-exceeded';
      };

export function decideJobAdmission(
    currentJobs: number,
    incomingJobs: number,
    maxConcurrentJobs: number,
): JobAdmissionDecision {
    const currentCapacity = maxConcurrentJobs - currentJobs;
    const proposedLoad = incomingJobs + currentJobs;
    if (incomingJobs <= currentCapacity) {
        return {
            accepted: true,
            resultingJobs: proposedLoad,
        };
    } else {
        return {
            accepted: false,
            reason: 'capacity-exceeded',
        };
    }
}
