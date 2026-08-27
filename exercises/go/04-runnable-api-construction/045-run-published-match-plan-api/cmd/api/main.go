package main

import (
	"log"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/handlers"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/services"
	"github.com/gin-gonic/gin"
)

func newRouter(plans []models.MatchPlan) *gin.Engine {
	matchPlanService := services.NewMatchPlanService(plans)

	matchPlanHandler := handlers.NewMatchPlanHandler(matchPlanService)

	r := gin.New()

	r.GET("/clubs/:clubID/match-plans/:planID", matchPlanHandler.GetMatchPlan)

	return r
}

func main() {
	router := newRouter(seedMatchPlans)

	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
