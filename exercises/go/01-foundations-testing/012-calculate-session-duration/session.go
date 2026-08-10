package session

type Session struct {
	ID          string
	StartMinute int
	EndMinute   int
}

func DurationMinutes(session Session) int {
	duration := session.EndMinute - session.StartMinute

	return duration
}
