package main

import "log"

func main() {
	router := newRouter()

	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
