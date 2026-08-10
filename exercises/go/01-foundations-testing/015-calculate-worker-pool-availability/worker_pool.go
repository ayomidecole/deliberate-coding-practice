package workerpool

import "errors"

var (
	ErrInvalidCapacity   = errors.New("invalid capacity")
	ErrInvalidActiveJobs = errors.New("invalid active jobs")
	ErrOverCapacity      = errors.New("active jobs over capacity")
)

type WorkerPool struct {
	Name       string
	Capacity   int
	ActiveJobs int
}

func AvailableSlots(pool WorkerPool) (int, error) {
	if pool.Capacity <= 0 {
		return 0, ErrInvalidCapacity
	}

	if pool.ActiveJobs < 0 {
		return 0, ErrInvalidActiveJobs
	}

	if pool.ActiveJobs > pool.Capacity {
		return 0, ErrOverCapacity
	}

	return pool.Capacity - pool.ActiveJobs, nil
}
