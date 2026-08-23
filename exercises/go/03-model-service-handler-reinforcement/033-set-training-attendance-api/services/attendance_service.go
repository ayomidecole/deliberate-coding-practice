package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/033-set-training-attendance-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/033-set-training-attendance-api/models"
)

var ErrInvalidAttendanceStatus = errors.New("attendance status is not supported")

type AttendanceService struct{}

func NewAttendanceService() *AttendanceService {
	return &AttendanceService{}
}

func (service *AttendanceService) SetAttendance(
	sessionID string,
	playerID string,
	status string,
) (models.AttendanceRecord, error) {
	if status != constants.AttendancePresent &&
		status != constants.AttendanceAbsent &&
		status != constants.AttendanceExcused {
		return models.AttendanceRecord{}, ErrInvalidAttendanceStatus
	}

	return models.AttendanceRecord{
		SessionID: sessionID,
		PlayerID:  playerID,
		Status:    status,
	}, nil
}
