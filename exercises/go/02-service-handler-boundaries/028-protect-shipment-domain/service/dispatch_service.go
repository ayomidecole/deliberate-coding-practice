package service

import "example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/028-protect-shipment-domain/domain"

type DispatchService struct{}

func NewDispatchService() *DispatchService {
	return &DispatchService{}
}

func (service *DispatchService) Dispatch(
	shipment domain.Shipment,
	availableWorkers int,
) (domain.Shipment, error) {
	return shipment.Dispatch(availableWorkers)
}
