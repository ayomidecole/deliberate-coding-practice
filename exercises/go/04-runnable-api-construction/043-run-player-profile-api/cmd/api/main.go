package main

import (
	"log"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/handlers"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/services"
	"github.com/gin-gonic/gin"
)


func newRouter(players []models.Player) *gin.Engine {
	playerService := services.NewPlayerService(players)

	playerHandler:= handlers.NewPlayerHandler(playerService)

	r := gin.New()

	r.GET("/clubs/:clubID/players/:playerID", playerHandler.GetPlayer)

	return r
}

func main() {
	router := newRouter(seedPlayers)

	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}