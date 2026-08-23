package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/033-set-training-attendance-api/services"
	"github.com/gin-gonic/gin"
)

type setAttendanceRequestJSON struct {
	Status string `json:"status"`
}

type attendanceResponseJSON struct {
	SessionID string `json:"sessionId"`
	PlayerID  string `json:"playerId"`
	Status    string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type AttendanceHandler struct {
	service *services.AttendanceService
}

func NewAttendanceHandler(service *services.AttendanceService) *AttendanceHandler {
	return &AttendanceHandler{service: service}
}

func (handler *AttendanceHandler) SetAttendance(c *gin.Context) {

	var body setAttendanceRequestJSON

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	attendance, err := handler.service.SetAttendance(
		c.Param("sessionID"),
		c.Param("playerID"),
		body.Status,
	)

	if errors.Is(err, services.ErrInvalidAttendanceStatus) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{
			Error: "invalid attendance status",
		})
		return
	}

	c.JSON(http.StatusOK, attendanceResponseJSON{
		SessionID: attendance.SessionID,
		PlayerID:  attendance.PlayerID,
		Status:    attendance.Status,
	})
}
