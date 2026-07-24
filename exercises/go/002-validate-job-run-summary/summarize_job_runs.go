package jobruns

import "fmt"

// JobStatus identifies the lifecycle state of a job run.
type JobStatus string

const (
	StatusQueued    JobStatus = "queued"
	StatusRunning   JobStatus = "running"
	StatusSucceeded JobStatus = "succeeded"
	StatusFailed    JobStatus = "failed"
)

// JobRun is one execution of a background job.
type JobRun struct {
	ID         string
	Status     JobStatus
	DurationMS int
}

// RunSummary contains aggregate information about a collection of job runs.
type RunSummary struct {
	Total           int
	Queued          int
	Running         int
	Succeeded       int
	Failed          int
	TotalDurationMS int
}

// SummarizeJobRuns summarizes job runs or returns an error for invalid input.
func SummarizeJobRuns(runs []JobRun) (RunSummary, error) {
	total := len(runs)
	queued := 0
	running := 0
	succeeded := 0
	failed := 0
	duration := 0

	for _, run := range runs {
		duration += run.DurationMS

		if run.DurationMS < 0 {
			return RunSummary{}, fmt.Errorf("duration is less than 0: %d", run.DurationMS)
		}

		switch run.Status {
		case StatusQueued:
			queued++
		case StatusRunning:
			running++
		case StatusSucceeded:
			succeeded++
		case StatusFailed:
			failed++
		default:
			return RunSummary{}, fmt.Errorf("the run status is not valid")
		}
	}

	return RunSummary{
		Total:           total,
		Queued:          queued,
		Running:         running,
		Succeeded:       succeeded,
		Failed:          failed,
		TotalDurationMS: duration,
	}, nil
}
