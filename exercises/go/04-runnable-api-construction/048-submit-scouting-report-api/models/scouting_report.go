package models

type ScoutingReport struct {
	ID       string
	ClubID   string
	PlayerID string
	Summary  string
	Rating   int
	Status   string
}
