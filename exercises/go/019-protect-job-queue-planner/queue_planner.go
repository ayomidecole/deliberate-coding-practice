package queueplanner

type Job struct {
	ID              string
	RequiredWorkers int
}

type QueuePlan struct {
	ScheduledIDs     []string
	UsedWorkers      int
	RemainingWorkers int
}

func PlanQueue(jobs []Job, workerLimit int) QueuePlan {
	plan := QueuePlan{
		RemainingWorkers: workerLimit,
	}

	for _, job := range jobs {

		if job.RequiredWorkers > plan.RemainingWorkers {
			continue
		}

		plan.ScheduledIDs = append(plan.ScheduledIDs, job.ID)
		plan.UsedWorkers += job.RequiredWorkers
		plan.RemainingWorkers -= job.RequiredWorkers
	}

	return plan
}
