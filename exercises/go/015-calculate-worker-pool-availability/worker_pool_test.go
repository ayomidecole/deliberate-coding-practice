package workerpool

import (
	"errors"
	"testing"
)

func TestAvailableSlotsRejectsInvalidCapacityFirst(t *testing.T) {
	pool := WorkerPool{
		Name:       "emails",
		Capacity:   0,
		ActiveJobs: -1,
	}

	slots, err := AvailableSlots(pool)

	if !errors.Is(err, ErrInvalidCapacity) {
		t.Fatalf("AvailableSlots() error = %v; want %v", err, ErrInvalidCapacity)
	}
	if got, want := slots, 0; got != want {
		t.Errorf("AvailableSlots() slots = %d; want %d", got, want)
	}
}

func TestAvailableSlotsRejectsNegativeActiveJobs(t *testing.T) {
	pool := WorkerPool{
		Name:       "reports",
		Capacity:   5,
		ActiveJobs: -1,
	}

	slots, err := AvailableSlots(pool)

	if !errors.Is(err, ErrInvalidActiveJobs) {
		t.Fatalf("AvailableSlots() error = %v; want %v", err, ErrInvalidActiveJobs)
	}
	if got, want := slots, 0; got != want {
		t.Errorf("AvailableSlots() slots = %d; want %d", got, want)
	}
}

func TestAvailableSlotsRejectsOverCapacityPool(t *testing.T) {
	pool := WorkerPool{
		Name:       "imports",
		Capacity:   3,
		ActiveJobs: 4,
	}

	slots, err := AvailableSlots(pool)

	if !errors.Is(err, ErrOverCapacity) {
		t.Fatalf("AvailableSlots() error = %v; want %v", err, ErrOverCapacity)
	}
	if got, want := slots, 0; got != want {
		t.Errorf("AvailableSlots() slots = %d; want %d", got, want)
	}
}

func TestAvailableSlotsReturnsZeroAtCapacity(t *testing.T) {
	pool := WorkerPool{
		Name:       "billing",
		Capacity:   4,
		ActiveJobs: 4,
	}

	slots, err := AvailableSlots(pool)

	if err != nil {
		t.Fatalf("AvailableSlots() error = %v; want nil", err)
	}
	if got, want := slots, 0; got != want {
		t.Errorf("AvailableSlots() slots = %d; want %d", got, want)
	}
}

func TestAvailableSlotsCalculatesRemainingCapacity(t *testing.T) {
	pool := WorkerPool{
		Name:       "thumbnails",
		Capacity:   8,
		ActiveJobs: 3,
	}

	slots, err := AvailableSlots(pool)

	if err != nil {
		t.Fatalf("AvailableSlots() error = %v; want nil", err)
	}
	if got, want := slots, 5; got != want {
		t.Errorf("AvailableSlots() slots = %d; want %d", got, want)
	}
}

func TestAvailableSlotsDoesNotModifyCallerValue(t *testing.T) {
	pool := WorkerPool{
		Name:       "notifications",
		Capacity:   10,
		ActiveJobs: 6,
	}
	before := pool

	AvailableSlots(pool)

	if pool != before {
		t.Errorf("AvailableSlots() changed pool to %+v; want %+v", pool, before)
	}
}
