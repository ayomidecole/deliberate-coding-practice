package main

import (
	"log"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/handlers"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/services"
	"github.com/gin-gonic/gin"
)

func newRouter(registrations []models.PlayerRegistration) *gin.Engine {
	service := services.NewPlayerRegistrationService(registrations)
	handler := handlers.NewPlayerRegistrationHandler(service)
	router := gin.Default()
	router.GET("/clubs/:clubID/player-registrations/:registrationID", handler.GetRegistration)
	router.PATCH("/clubs/:clubID/player-registrations/:registrationID", handler.PatchRegistration)
	return router
}

func main() {
	router := newRouter(seedPlayerRegistrations())

	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
