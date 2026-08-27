package handlers

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/models"

type matchPlanResponseJSON struct {
	ID           string `json:"id"`
	ClubID       string `json:"clubId"`
	OpponentName string `json:"opponentName"`
	Formation    string `json:"formation"`
	Status       string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

func newMatchPlanResponseJSON(plan models.MatchPlan) matchPlanResponseJSON {
	return matchPlanResponseJSON{
		ID:           plan.ID,
		ClubID:       plan.ClubID,
		OpponentName: plan.OpponentName,
		Formation:    plan.Formation,
		Status:       plan.Status,
	}
}
