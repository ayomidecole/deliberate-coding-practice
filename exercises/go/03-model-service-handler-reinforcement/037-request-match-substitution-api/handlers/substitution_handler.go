package handlers

import (
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-request-match-substitution-api/services"
	"github.com/gin-gonic/gin"
)

type requestSubstitutionRequestJSON struct {
	SubstitutionID   string `json:"substitutionId"`
	OutgoingPlayerID string `json:"outgoingPlayerId"`
	IncomingPlayerID string `json:"incomingPlayerId"`
}

type substitutionResponseJSON struct {
	ID               string `json:"id"`
	MatchID          string `json:"matchId"`
	OutgoingPlayerID string `json:"outgoingPlayerId"`
	IncomingPlayerID string `json:"incomingPlayerId"`
	Status           string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type SubstitutionHandler struct {
	service *services.SubstitutionService
}

func NewSubstitutionHandler(service *services.SubstitutionService) *SubstitutionHandler {
	return &SubstitutionHandler{service: service}
}

func (handler *SubstitutionHandler) RequestSubstitution(c *gin.Context) {
}
