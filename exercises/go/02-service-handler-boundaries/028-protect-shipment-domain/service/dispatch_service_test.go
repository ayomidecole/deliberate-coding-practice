package service

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/028-protect-shipment-domain/domain"
)

func TestDispatchServiceUsesDomainTransition(t *testing.T) {
	service := NewDispatchService()
	shipment := domain.Shipment{
		ID:              "shipment-201",
		Status:          domain.StatusReady,
		RequiredWorkers: 2,
	}

	got, err := service.Dispatch(shipment, 2)

	if err != nil {
		t.Fatalf("Dispatch() error = %v; want nil", err)
	}
	if got.Status != domain.StatusDispatched {
		t.Errorf("Dispatch() status = %q; want %q", got.Status, domain.StatusDispatched)
	}
}

func TestDispatchServicePreservesDomainError(t *testing.T) {
	service := NewDispatchService()
	shipment := domain.Shipment{
		ID:              "shipment-202",
		Status:          domain.StatusPending,
		RequiredWorkers: 2,
	}

	got, err := service.Dispatch(shipment, 2)

	if !errors.Is(err, domain.ErrShipmentNotReady) {
		t.Fatalf("Dispatch() error = %v; want %v", err, domain.ErrShipmentNotReady)
	}
	if got != shipment {
		t.Errorf("Dispatch() = %+v; want unchanged %+v", got, shipment)
	}
}
