package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/033-set-training-attendance-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/033-set-training-attendance-api/services"
	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestSetAttendanceRejectsMalformedJSON(t *testing.T) {
	router := newTestRouter()

	response := performAttendanceRequest(
		router,
		"training-303",
		"player-403",
		`{`,
	)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestSetAttendanceRejectsUnsupportedStatus(t *testing.T) {
	router := newTestRouter()

	response := performAttendanceRequest(
		router,
		"training-304",
		"player-404",
		`{"status":"late"}`,
	)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid attendance status")
}

func TestSetAttendanceReturnsUpdatedRecord(t *testing.T) {
	router := newTestRouter()

	response := performAttendanceRequest(
		router,
		"training-304",
		"player-404",
		`{"status":"present"}`,
	)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got attendanceResponseJSON
	decodeResponse(t, response, &got)
	want := attendanceResponseJSON{
		SessionID: "training-304",
		PlayerID:  "player-404",
		Status:    constants.AttendancePresent,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func newTestRouter() *gin.Engine {
	service := services.NewAttendanceService()
	handler := NewAttendanceHandler(service)
	router := gin.New()
	router.PUT(
		"/training-sessions/:sessionID/attendance/:playerID",
		handler.SetAttendance,
	)
	return router
}

func performAttendanceRequest(
	router *gin.Engine,
	sessionID string,
	playerID string,
	body string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPut,
		fmt.Sprintf(
			"/training-sessions/%s/attendance/%s",
			sessionID,
			playerID,
		),
		strings.NewReader(body),
	)
	request.Header.Set("Content-Type", "application/json")

	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	return response
}

func assertErrorResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	want string,
) {
	t.Helper()

	var got errorResponseJSON
	decodeResponse(t, response, &got)
	if got.Error != want {
		t.Errorf("error = %q; want %q", got.Error, want)
	}
}

func decodeResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	target any,
) {
	t.Helper()

	if err := json.Unmarshal(response.Body.Bytes(), target); err != nil {
		t.Fatalf("decode response: %v", err)
	}
}
