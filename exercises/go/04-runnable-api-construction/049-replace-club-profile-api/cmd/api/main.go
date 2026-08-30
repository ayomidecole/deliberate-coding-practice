package main

import "log"

func main() {
	router := newRouter(seedClubProfiles())

	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
