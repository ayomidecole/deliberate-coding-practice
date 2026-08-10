package statusapi

import "net/http"

// catalogStatusHandler is a complete example of writing one HTTP response.
func catalogStatusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("catalog service is ready\n"))
}

// StatusHandler reports whether the inventory service is ready.
func StatusHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: adapt the pattern above.
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("inventory service is ready\n"))
}
