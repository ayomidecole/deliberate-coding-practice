package jobruns

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

// SummarizeJobRuns summarizes valid job runs.
func SummarizeJobRuns(runs []JobRun) RunSummary {
	total := len(runs)

	queued := 0
	running := 0
	succeeded := 0
	failed := 0
	duration := 0

	for _, run := range runs {

		duration += run.DurationMS

		switch run.Status {
		case StatusQueued:
			queued++
		case StatusRunning:
			running++
		case StatusSucceeded:
			succeeded++
		case StatusFailed:
			failed++
		}
	}

	return RunSummary{
		Total:           total,
		Queued:          queued,
		Running:         running,
		Succeeded:       succeeded,
		Failed:          failed,
		TotalDurationMS: duration,
	}
}
