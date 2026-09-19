package main

import (
	"io"
	"log"
	"os"
	"path/filepath"
	"runtime"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/handlers"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/services"
	"github.com/gin-gonic/gin"
)

func newRouter(profiles []models.ClubProfile) *gin.Engine {
	clubProfileService := services.NewClubProfileService(profiles)
	clubProfileHandler := handlers.NewClubProfileHandler(clubProfileService)

	r := gin.Default()

	r.GET("/clubs/:clubID/profile", clubProfileHandler.GetProfile)
	r.PUT("/clubs/:clubID/profile", clubProfileHandler.ReplaceProfile)

	return r
}

func main() {
	_, sourceFile, _, ok := runtime.Caller(0)
	if !ok {
		log.Fatal("could not determine log file path")
	}
	logPath := filepath.Join(filepath.Dir(sourceFile), "..", "..", "gin.log")

	logFile, err := os.Create(logPath)
	if err != nil {
		log.Fatal(err)
	}
	defer logFile.Close()

	gin.DefaultWriter = io.MultiWriter(os.Stdout, logFile)

	router := newRouter(seedClubProfiles())

	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
