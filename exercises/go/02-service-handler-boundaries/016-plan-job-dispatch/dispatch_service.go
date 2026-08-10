package dispatch

import "errors"

const StatusScheduled = "scheduled"

var (
	ErrAttemptsExhausted   = errors.New("job attempts exhausted")
	ErrInsufficientWorkers = errors.New("insufficient workers")
)

type DispatchRequest struct {
	JobID            string
	RequiredWorkers  int
	AvailableWorkers int
	Attempts         int
	MaxAttempts      int
}

type DispatchPlan struct {
	JobID            string
	Status           string
	WorkersAssigned  int
	RemainingWorkers int
	Attempt          int
}

func PlanDispatch(request DispatchRequest) (DispatchPlan, error) {

	if request.Attempts >= request.MaxAttempts {
		return DispatchPlan{}, ErrAttemptsExhausted
	}

	if request.AvailableWorkers < request.RequiredWorkers {
		return DispatchPlan{}, ErrInsufficientWorkers
	}

	return DispatchPlan{
		JobID:            request.JobID,
		Status:           StatusScheduled,
		WorkersAssigned:  request.RequiredWorkers,
		RemainingWorkers: request.AvailableWorkers - request.RequiredWorkers,
		Attempt:          request.Attempts + 1,
	}, nil
}
