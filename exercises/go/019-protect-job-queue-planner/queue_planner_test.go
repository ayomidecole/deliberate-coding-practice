package queueplanner

import (
	"slices"
	"testing"
)

func TestPlanQueueSchedulesJobsThatFit(t *testing.T) {
	jobs := []Job{
		{ID: "email-digest", RequiredWorkers: 2},
		{ID: "invoice-export", RequiredWorkers: 3},
	}

	got := PlanQueue(jobs, 6)
	want := QueuePlan{
		ScheduledIDs:     []string{"email-digest", "invoice-export"},
		UsedWorkers:      5,
		RemainingWorkers: 1,
	}

	assertQueuePlan(t, got, want)
}

func TestJobScheduledAtWorkerLimit(t *testing.T) {
	jobs := []Job{
		{ID: "email-digest", RequiredWorkers: 2},
		{ID: "invoice-export", RequiredWorkers: 3},
	}

	got := PlanQueue(jobs, 5)

	want := QueuePlan{
		ScheduledIDs:     []string{"email-digest", "invoice-export"},
		UsedWorkers:      5,
		RemainingWorkers: 0,
	}

	assertQueuePlan(t, got, want)
}

func TestPlanQueueSkipsJobThatDoesNotFitAndContinues(t *testing.T) {
	jobs := []Job{
		{ID: "email-digest", RequiredWorkers: 2},
		{ID: "invoice-export", RequiredWorkers: 7},
		{ID: "invoice-import", RequiredWorkers: 3},
	}

	got := PlanQueue(jobs, 6)

	want := QueuePlan{
		ScheduledIDs:     []string{"email-digest", "invoice-import"},
		UsedWorkers:      5,
		RemainingWorkers: 1,
	}

	assertQueuePlan(t, got, want)
}

func assertQueuePlan(t *testing.T, got, want QueuePlan) {
	t.Helper()

	if !slices.Equal(got.ScheduledIDs, want.ScheduledIDs) {
		t.Errorf(
			"ScheduledIDs = %v; want %v",
			got.ScheduledIDs,
			want.ScheduledIDs,
		)
	}
	if got.UsedWorkers != want.UsedWorkers {
		t.Errorf("UsedWorkers = %d; want %d", got.UsedWorkers, want.UsedWorkers)
	}
	if got.RemainingWorkers != want.RemainingWorkers {
		t.Errorf(
			"RemainingWorkers = %d; want %d",
			got.RemainingWorkers,
			want.RemainingWorkers,
		)
	}
}
