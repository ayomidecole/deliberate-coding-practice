package productapi

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Product is the public JSON representation returned by this API.
type Product struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Stock int    `json:"stock"`
}

var productCatalog = map[string]Product{
	"keyboard": {
		ID:    "keyboard",
		Name:  "Mechanical Keyboard",
		Stock: 10,
	},
	"mouse": {
		ID:    "mouse",
		Name:  "Wireless Mouse",
		Stock: 6,
	},
}

// NewRouter creates the HTTP router for this exercise.
func NewRouter() *gin.Engine {
	router := gin.New()

	router.GET("/api/products/:id", getProduct)

	return router
}

// getProduct writes either the requested product or the required not-found response.
func getProduct(c *gin.Context) {
	id := c.Param("id")

	item, found := findProduct(id)

	if !found {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "product not found",
		})
		return
	}

	c.JSON(http.StatusOK, item)
}

// findProduct hides the catalog representation from the HTTP handler.
func findProduct(id string) (Product, bool) {
	product, found := productCatalog[id]
	return product, found
}
