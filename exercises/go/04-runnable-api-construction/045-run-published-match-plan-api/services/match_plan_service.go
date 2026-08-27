package services

import (
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/models"
)

type MatchPlanService struct {
	plans []models.MatchPlan
}

func NewMatchPlanService(plans []models.MatchPlan) *MatchPlanService {
	return &MatchPlanService{plans: plans}
}

func (service *MatchPlanService) GetPublishedMatchPlan(
	clubID string,
	planID string,
) (models.MatchPlan, error) {
	for _, plan := range service.plans {
		if plan.ID == planID && plan.ClubID == clubID {
			if plan.Status != constants.MatchPlanStatusPublished {
				return models.MatchPlan{}, ErrMatchPlanNotPublished
			}
			return plan, nil
		}
	}
	return models.MatchPlan{}, ErrMatchPlanNotFound
}
