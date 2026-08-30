package main

import (
	"log"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/handlers"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/services"
	"github.com/gin-gonic/gin"
)

func newRouter() *gin.Engine {
	scoutingReportService := services.NewScoutingReportService()
	scoutingReportHandler := handlers.NewScoutingReportHandler(scoutingReportService)

	r := gin.Default()

	r.POST("/clubs/:clubID/scouting-reports", scoutingReportHandler.CreateScoutingReport)

	return r
}

func main() {
	router := newRouter()

	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
