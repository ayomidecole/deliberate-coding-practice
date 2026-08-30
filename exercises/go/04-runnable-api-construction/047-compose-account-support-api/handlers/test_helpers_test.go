package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func performHandlerRequest(
	t *testing.T,
	handler gin.HandlerFunc,
	accountID string,
) *httptest.ResponseRecorder {
	t.Helper()
	gin.SetMode(gin.TestMode)

	response := httptest.NewRecorder()
	context, _ := gin.CreateTestContext(response)
	context.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	context.Params = gin.Params{{Key: "accountID", Value: accountID}}
	handler(context)
	return response
}
