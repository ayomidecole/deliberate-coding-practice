package admission

import "testing"

func TestAdmissionDecisionAcceptsBelowCapacity(t *testing.T) {
	if got, want := AdmissionDecision(2, 5), "accept"; got != want {
		t.Errorf("AdmissionDecision(2, 5) = %q; want %q", got, want)
	}
}

func TestNegativeActiveJobsReturnsInvalid(t *testing.T) {
	if got, want := AdmissionDecision(-2, 15), "invalid"; got != want {
		t.Errorf("AdmissionDecision(-2, 15) = %q; want %q", got, want)
	}
}
func TestZeroActiveJobsWithCapacityReturnsAccept(t *testing.T) {
	if got, want := AdmissionDecision(0, 15), "accept"; got != want {
		t.Errorf("AdmissionDecision(0, 15) = %q; want %q", got, want)
	}
}

func TestZeroCapacityReturnsInvalid(t *testing.T) {
	if got, want := AdmissionDecision(2, 0), "invalid"; got != want {
		t.Errorf("AdmissionDecision(2, 0) = %q; want %q", got, want)
	}
}

func TestActiveJobAboveCapacityReturnsFull(t *testing.T) {
	if got, want := AdmissionDecision(6, 5), "full"; got != want {
		t.Errorf("AdmissionDecision(6, 5) = %q; want %q", got, want)
	}
}

func TestEqualCapacityAndActiveJobsReturnsFull(t *testing.T) {
	if got, want := AdmissionDecision(5, 5), "full"; got != want {
		t.Errorf("AdmissionDecision(5, 5) = %q; want %q", got, want)
	}
}
