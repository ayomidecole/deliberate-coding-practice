package dispatch

import (
	"errors"
	"testing"
)

func TestPlanDispatchPrioritizesExhaustedAttempts(t *testing.T) {
	request := DispatchRequest{
		JobID:            "job-201",
		RequiredWorkers:  4,
		AvailableWorkers: 2,
		Attempts:         3,
		MaxAttempts:      3,
	}

	plan, err := PlanDispatch(request)

	if !errors.Is(err, ErrAttemptsExhausted) {
		t.Fatalf("PlanDispatch() error = %v; want %v", err, ErrAttemptsExhausted)
	}
	if plan != (DispatchPlan{}) {
		t.Errorf("PlanDispatch() plan = %+v; want empty plan", plan)
	}
}

func TestPlanDispatchRejectsAttemptsAboveLimit(t *testing.T) {
	request := DispatchRequest{
		JobID:            "job-202",
		RequiredWorkers:  2,
		AvailableWorkers: 5,
		Attempts:         4,
		MaxAttempts:      3,
	}

	plan, err := PlanDispatch(request)

	if !errors.Is(err, ErrAttemptsExhausted) {
		t.Fatalf("PlanDispatch() error = %v; want %v", err, ErrAttemptsExhausted)
	}
	if plan != (DispatchPlan{}) {
		t.Errorf("PlanDispatch() plan = %+v; want empty plan", plan)
	}
}

func TestPlanDispatchRejectsInsufficientWorkers(t *testing.T) {
	request := DispatchRequest{
		JobID:            "job-203",
		RequiredWorkers:  4,
		AvailableWorkers: 3,
		Attempts:         1,
		MaxAttempts:      3,
	}

	plan, err := PlanDispatch(request)

	if !errors.Is(err, ErrInsufficientWorkers) {
		t.Fatalf("PlanDispatch() error = %v; want %v", err, ErrInsufficientWorkers)
	}
	if plan != (DispatchPlan{}) {
		t.Errorf("PlanDispatch() plan = %+v; want empty plan", plan)
	}
}

func TestPlanDispatchUsesExactWorkerCapacity(t *testing.T) {
	request := DispatchRequest{
		JobID:            "job-204",
		RequiredWorkers:  4,
		AvailableWorkers: 4,
		Attempts:         0,
		MaxAttempts:      3,
	}
	want := DispatchPlan{
		JobID:            "job-204",
		Status:           StatusScheduled,
		WorkersAssigned:  4,
		RemainingWorkers: 0,
		Attempt:          1,
	}

	got, err := PlanDispatch(request)

	if err != nil {
		t.Fatalf("PlanDispatch() error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("PlanDispatch() plan = %+v; want %+v", got, want)
	}
}

func TestPlanDispatchBuildsCompletePlan(t *testing.T) {
	request := DispatchRequest{
		JobID:            "job-205",
		RequiredWorkers:  3,
		AvailableWorkers: 8,
		Attempts:         2,
		MaxAttempts:      5,
	}
	want := DispatchPlan{
		JobID:            "job-205",
		Status:           StatusScheduled,
		WorkersAssigned:  3,
		RemainingWorkers: 5,
		Attempt:          3,
	}

	got, err := PlanDispatch(request)

	if err != nil {
		t.Fatalf("PlanDispatch() error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("PlanDispatch() plan = %+v; want %+v", got, want)
	}
}

func TestPlanDispatchDoesNotModifyRequest(t *testing.T) {
	request := DispatchRequest{
		JobID:            "job-206",
		RequiredWorkers:  2,
		AvailableWorkers: 6,
		Attempts:         1,
		MaxAttempts:      4,
	}
	before := request

	PlanDispatch(request)

	if request != before {
		t.Errorf("PlanDispatch() changed request to %+v; want %+v", request, before)
	}
}
