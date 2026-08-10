package domain

import (
	"errors"
	"testing"
)

func TestDispatchRejectsNonReadyShipmentFirst(t *testing.T) {
	shipment := Shipment{
		ID:              "shipment-101",
		Status:          StatusPending,
		RequiredWorkers: 3,
	}

	got, err := shipment.Dispatch(1)

	if !errors.Is(err, ErrShipmentNotReady) {
		t.Fatalf("Dispatch() error = %v; want %v", err, ErrShipmentNotReady)
	}
	if got != shipment {
		t.Errorf("Dispatch() = %+v; want unchanged %+v", got, shipment)
	}
}

func TestDispatchRejectsInsufficientWorkers(t *testing.T) {
	shipment := Shipment{
		ID:              "shipment-102",
		Status:          StatusReady,
		RequiredWorkers: 3,
	}

	got, err := shipment.Dispatch(2)

	if !errors.Is(err, ErrInsufficientWorkers) {
		t.Fatalf("Dispatch() error = %v; want %v", err, ErrInsufficientWorkers)
	}
	if got != shipment {
		t.Errorf("Dispatch() = %+v; want unchanged %+v", got, shipment)
	}
}

func TestDispatchSucceedsAtExactCapacity(t *testing.T) {
	shipment := Shipment{
		ID:              "shipment-103",
		Status:          StatusReady,
		RequiredWorkers: 3,
	}
	original := shipment

	got, err := shipment.Dispatch(3)

	if err != nil {
		t.Fatalf("Dispatch() error = %v; want nil", err)
	}
	want := Shipment{
		ID:              "shipment-103",
		Status:          StatusDispatched,
		RequiredWorkers: 3,
	}
	if got != want {
		t.Errorf("Dispatch() = %+v; want %+v", got, want)
	}
	if shipment != original {
		t.Errorf("Dispatch() changed caller value to %+v; want %+v", shipment, original)
	}
}

func TestDispatchSucceedsAboveRequiredCapacity(t *testing.T) {
	shipment := Shipment{
		ID:              "shipment-104",
		Status:          StatusReady,
		RequiredWorkers: 2,
	}

	got, err := shipment.Dispatch(5)

	if err != nil {
		t.Fatalf("Dispatch() error = %v; want nil", err)
	}
	want := Shipment{
		ID:              "shipment-104",
		Status:          StatusDispatched,
		RequiredWorkers: 2,
	}
	if got != want {
		t.Errorf("Dispatch() = %+v; want %+v", got, want)
	}
}
