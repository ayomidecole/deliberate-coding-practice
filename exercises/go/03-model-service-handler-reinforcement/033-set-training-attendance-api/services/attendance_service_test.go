package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/033-set-training-attendance-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/033-set-training-attendance-api/models"
)

func TestSetAttendanceRejectsUnsupportedStatus(t *testing.T) {
	service := NewAttendanceService()

	got, err := service.SetAttendance("training-301", "player-401", "late")

	if !errors.Is(err, ErrInvalidAttendanceStatus) {
		t.Fatalf("SetAttendance() error = %v; want %v", err, ErrInvalidAttendanceStatus)
	}
	if got != (models.AttendanceRecord{}) {
		t.Errorf("SetAttendance() = %+v; want empty record", got)
	}
}

func TestSetAttendanceReturnsValidRecord(t *testing.T) {
	service := NewAttendanceService()

	got, err := service.SetAttendance(
		"training-302",
		"player-402",
		constants.AttendancePresent,
	)

	if err != nil {
		t.Fatalf("SetAttendance() error = %v; want nil", err)
	}
	want := models.AttendanceRecord{
		SessionID: "training-302",
		PlayerID:  "player-402",
		Status:    constants.AttendancePresent,
	}
	if got != want {
		t.Errorf("SetAttendance() = %+v; want %+v", got, want)
	}
}
