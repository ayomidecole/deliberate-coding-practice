package session

import "testing"

func TestDurationMinutes(t *testing.T) {
	session := Session{
		ID:          "standup",
		StartMinute: 540,
		EndMinute:   575,
	}

	if got, want := DurationMinutes(session), 35; got != want {
		t.Errorf("DurationMinutes() = %d; want %d", got, want)
	}
}

func TestDurationMinutesAllowsZeroDuration(t *testing.T) {
	session := Session{
		ID:          "status-check",
		StartMinute: 600,
		EndMinute:   600,
	}

	if got, want := DurationMinutes(session), 0; got != want {
		t.Errorf("DurationMinutes() = %d; want %d", got, want)
	}
}

func TestDurationMinutesDoesNotModifyCallerValue(t *testing.T) {
	session := Session{
		ID:          "planning",
		StartMinute: 780,
		EndMinute:   825,
	}
	before := session

	DurationMinutes(session)

	if session != before {
		t.Errorf("DurationMinutes() changed session to %+v; want %+v", session, before)
	}
}
