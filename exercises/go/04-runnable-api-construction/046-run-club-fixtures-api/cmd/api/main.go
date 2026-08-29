package main

import (
	"log"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/handlers"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/services"
	"github.com/gin-gonic/gin"
)

func newRouter(fixtures []models.Fixture) *gin.Engine {
	fixtureService := services.NewFixtureService(fixtures)

	fixtureHandler := handlers.NewFixtureHandler(fixtureService)

	r := gin.Default()

	r.GET("/clubs/:clubID/fixtures", fixtureHandler.ListFixtures)
	r.GET("/clubs/:clubID/fixtures/:fixtureID", fixtureHandler.GetFixture)

	return r
}

func main() {
	router := newRouter(seedFixtures)
	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
