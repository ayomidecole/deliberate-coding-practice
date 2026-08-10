package domain

import "errors"

const (
	StatusPending    = "pending"
	StatusReady      = "ready"
	StatusDispatched = "dispatched"
)

var (
	ErrShipmentNotReady    = errors.New("shipment is not ready")
	ErrInsufficientWorkers = errors.New("insufficient workers")
)

type Shipment struct {
	ID              string
	Status          string
	RequiredWorkers int
}

func (shipment Shipment) Dispatch(availableWorkers int) (Shipment, error) {

	insufficientWorkers := availableWorkers < shipment.RequiredWorkers

	if shipment.Status != StatusReady {
		return shipment, ErrShipmentNotReady
	}

	if shipment.Status == StatusReady && insufficientWorkers {
		return shipment, ErrInsufficientWorkers
	}
	return Shipment{
		ID:              shipment.ID,
		Status:          StatusDispatched,
		RequiredWorkers: shipment.RequiredWorkers,
	}, nil
}
