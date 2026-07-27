package jobstatus

import "testing"

func TestNextJobStatusStartsQueuedJob(t *testing.T) {
	job := Job{
		ID:          "job-101",
		Status:      StatusQueued,
		Attempts:    0,
		MaxAttempts: 3,
	}

	if got, want := NextJobStatus(job), StatusRunning; got != want {
		t.Errorf("NextJobStatus() = %q; want %q", got, want)
	}
}

func TestNextJobStatusKeepsRunningJobBelowLimit(t *testing.T) {
	job := Job{
		ID:          "job-102",
		Status:      StatusRunning,
		Attempts:    2,
		MaxAttempts: 3,
	}

	if got, want := NextJobStatus(job), StatusRunning; got != want {
		t.Errorf("NextJobStatus() = %q; want %q", got, want)
	}
}

func TestNextJobStatusFailsJobAtAttemptLimit(t *testing.T) {
	job := Job{
		ID:          "job-103",
		Status:      StatusRunning,
		Attempts:    3,
		MaxAttempts: 3,
	}

	if got, want := NextJobStatus(job), StatusFailed; got != want {
		t.Errorf("NextJobStatus() = %q; want %q", got, want)
	}
}

func TestNextJobStatusFailsJobAboveAttemptLimit(t *testing.T) {
	job := Job{
		ID:          "job-104",
		Status:      StatusQueued,
		Attempts:    4,
		MaxAttempts: 3,
	}

	if got, want := NextJobStatus(job), StatusFailed; got != want {
		t.Errorf("NextJobStatus() = %q; want %q", got, want)
	}
}

func TestNextJobStatusPreservesSucceededTerminalStatus(t *testing.T) {
	job := Job{
		ID:          "job-105",
		Status:      StatusSucceeded,
		Attempts:    3,
		MaxAttempts: 3,
	}

	if got, want := NextJobStatus(job), StatusSucceeded; got != want {
		t.Errorf("NextJobStatus() = %q; want %q", got, want)
	}
}

func TestNextJobStatusPreservesFailedTerminalStatus(t *testing.T) {
	job := Job{
		ID:          "job-106",
		Status:      StatusFailed,
		Attempts:    1,
		MaxAttempts: 3,
	}

	if got, want := NextJobStatus(job), StatusFailed; got != want {
		t.Errorf("NextJobStatus() = %q; want %q", got, want)
	}
}

func TestNextJobStatusDoesNotModifyCallerValue(t *testing.T) {
	job := Job{
		ID:          "job-107",
		Status:      StatusQueued,
		Attempts:    1,
		MaxAttempts: 3,
	}
	before := job

	NextJobStatus(job)

	if job != before {
		t.Errorf("NextJobStatus() changed job to %+v; want %+v", job, before)
	}
}
