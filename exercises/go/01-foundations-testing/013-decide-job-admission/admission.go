package admission

func AdmissionDecision(activeJobs, capacity int) string {
	if activeJobs < 0 || capacity <= 0 {
		return "invalid"
	}

	if activeJobs >= capacity {
		return "full"
	}

	return "accept"
}
