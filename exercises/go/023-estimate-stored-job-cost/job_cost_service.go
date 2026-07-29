package jobcost

import jobstore "example.com/deliberate-coding-practice/exercises/go/020-build-in-memory-job-store"

type CostEstimate struct {
	JobID           string
	RequiredWorkers int
	TotalCostCents  int
	WithinBudget    bool
}

func EstimateJobCost(
	store *jobstore.JobStore,
	jobID string,
	costPerWorkerCents int,
	budgetCents int,
) (CostEstimate, error) {
	job, err := store.FindByID(jobID)

	if err != nil {
		return CostEstimate{}, err
	}

	return CostEstimate{
		JobID:           job.ID,
		RequiredWorkers: job.RequiredWorkers,
		TotalCostCents:  costPerWorkerCents * job.RequiredWorkers,
		WithinBudget:    (costPerWorkerCents * job.RequiredWorkers) <= budgetCents,
	}, nil
}
