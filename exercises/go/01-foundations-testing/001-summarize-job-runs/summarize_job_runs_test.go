package jobruns

import "testing"

func TestSummarizeJobRunsEmpty(t *testing.T) {
	got := SummarizeJobRuns(nil)
	want := RunSummary{}
	if got != want {
		t.Errorf("SummarizeJobRuns(nil) = %+v; want %+v", got, want)
	}
}

func TestSummarizeJobRuns(t *testing.T) {
	runs := []JobRun{
		{ID: "1", Status: StatusQueued, DurationMS: 1000},
		{ID: "2", Status: StatusRunning, DurationMS: 2000},
		{ID: "3", Status: StatusSucceeded, DurationMS: 3000},
		{ID: "4", Status: StatusFailed, DurationMS: 4000},
		{ID: "5", Status: StatusQueued, DurationMS: 5000},
		{ID: "6", Status: StatusRunning, DurationMS: 6000},
	}

	got := SummarizeJobRuns(runs)

	want := RunSummary{
		Total:           6,
		Queued:          2,
		Running:         2,
		Succeeded:       1,
		Failed:          1,
		TotalDurationMS: 21000,
	}

	if got != want {
		t.Errorf("SummarizeJobRuns(runs) = %+v; want %+v", got, want)
	}
}
