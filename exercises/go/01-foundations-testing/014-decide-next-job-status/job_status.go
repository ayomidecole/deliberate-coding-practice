package jobstatus

const (
	StatusQueued    = "queued"
	StatusRunning   = "running"
	StatusSucceeded = "succeeded"
	StatusFailed    = "failed"
)

type Job struct {
	ID          string
	Status      string
	Attempts    int
	MaxAttempts int
}

func NextJobStatus(job Job) string {
	if job.Status == StatusSucceeded || job.Status == StatusFailed {
		return job.Status
	}

	if job.Attempts >= job.MaxAttempts {
		return StatusFailed
	}

	return StatusRunning
}
