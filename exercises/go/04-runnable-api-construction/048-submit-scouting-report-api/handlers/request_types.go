package handlers

type createScoutingReportRequestJSON struct {
	ReportID string `json:"reportId"`
	PlayerID string `json:"playerId"`
	Summary  string `json:"summary"`
	Rating   int    `json:"rating"`
}
