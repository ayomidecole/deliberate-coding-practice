package jobruns

import "testing"

func TestSummarizeJobRunsValidInput(t *testing.T) {
	runs := []JobRun{
		{ID: "1", Status: StatusQueued, DurationMS: 10},
		{ID: "2", Status: StatusSucceeded, DurationMS: 20},
	}

	got, err := SummarizeJobRuns(runs)
	if err != nil {
		t.Fatalf("SummarizeJobRuns(valid runs) returned unexpected error: %v", err)
	}

	want := RunSummary{
		Total:           2,
		Queued:          1,
		Succeeded:       1,
		TotalDurationMS: 30,
	}
	if got != want {
		t.Errorf("SummarizeJobRuns(valid runs) = %+v; want %+v", got, want)
	}
}

func TestSummarizeJobRunsRejectsNegativeDuration(t *testing.T) {
	runs := []JobRun{
		{ID: "1", Status: StatusFailed, DurationMS: -1},
	}

	got, err := SummarizeJobRuns(runs)
	if err == nil {
		t.Error("SummarizeJobRuns(negative duration) returned nil error; want non-nil error")
	}

	want := RunSummary{}
	if got != want {
		t.Errorf("SummarizeJobRuns(negative duration) = %+v; want %+v", got, want)
	}
}

func TestSummarizeJobRehectsInvalidStatus(t *testing.T) {
	runs := []JobRun{
		{ID: "1", Status: StatusSucceeded, DurationMS: 20},
		{ID: "2", Status: "invalid", DurationMS: 10},
	}

	got, err := SummarizeJobRuns(runs)

	if err == nil {
		t.Error("SummarizeJobRuns(invalid status) returned nil error; want non-nil error")
	}

	want := RunSummary{}
	if got != want {
		t.Errorf("SummarizeJobRuns(invalid status) = %+v; want %+v", got, want)
	}
}

func TestZeroDurationIsValid(t *testing.T) {
	runs := []JobRun{
		{ID: "1", Status: StatusSucceeded, DurationMS: 0},
	}

	got, err := SummarizeJobRuns(runs)

	if err != nil {
		t.Fatalf("SummarizeJobRuns(valid runs) returned unexpected error: %v", err)
	}

	want := RunSummary{
		Total:           1,
		Queued:          0,
		Running:         0,
		Succeeded:       1,
		Failed:          0,
		TotalDurationMS: 0,
	}

	if got != want {
		t.Errorf("SummarizeJobRuns(valid runs) = %+v; want %+v", got, want)
	}
}

func TestEmptyInputIsValid(t *testing.T) {
	runs := []JobRun{}

	got, err := SummarizeJobRuns(runs)

	if err != nil {
		t.Fatalf("SummarizeJobRuns(valid runs) returned unexpected error: %v", err)
	}

	want := RunSummary{}

	if got != want {
		t.Errorf("SummarizeJobRuns(valid runs) = %+v; want %+v", got, want)
	}
}
