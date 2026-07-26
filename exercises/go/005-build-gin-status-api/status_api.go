package statusapi

import "github.com/gin-gonic/gin"

// NewRouter creates the HTTP router for this exercise.
func NewRouter() *gin.Engine {
	router := gin.New()

	// TODO: register GET /api/status.
	router.GET("/api/status", getStatus)

	return router
}

// getStatus writes the inventory service status response.
func getStatus(c *gin.Context) {
	// TODO: write the required JSON response.
	c.JSON(200, gin.H{
		"service": "inventory",
		"status":  "ready",
	})
}
