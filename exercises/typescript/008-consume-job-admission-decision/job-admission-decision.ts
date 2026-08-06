export type JobAdmissionDecision =
    | {
          readonly accepted: true;
          readonly resultingJobs: number;
      }
    | {
          readonly accepted: false;
          readonly reason: 'capacity-exceeded';
      };
