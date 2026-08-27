package main

import (
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/models"
)

var seedMatchPlans = []models.MatchPlan{
	{
		ID:           "plan-5101",
		ClubID:       "club-1001",
		OpponentName: "Lisbon Athletic",
		Formation:    "4-3-3",
		Status:       constants.MatchPlanStatusPublished,
	},
	{
		ID:           "plan-5102",
		ClubID:       "club-1001",
		OpponentName: "Porto United",
		Formation:    "4-2-3-1",
		Status:       constants.MatchPlanStatusDraft,
	},
}
