package service

import "errors"

var ErrInvalidDistance = errors.New("distance must be positive")

type ShippingQuote struct {
	ShipmentID       string
	DistanceMiles    int
	RatePerMileCents int
	TotalCostCents   int
}

type QuoteService struct{}

func NewQuoteService() *QuoteService {
	return &QuoteService{}
}

func (service *QuoteService) BuildQuote(
	shipmentID string,
	distanceMiles int,
	ratePerMileCents int,
) (ShippingQuote, error) {
	if distanceMiles <= 0 {
		return ShippingQuote{}, ErrInvalidDistance
	}

	return ShippingQuote{
		ShipmentID:       shipmentID,
		DistanceMiles:    distanceMiles,
		RatePerMileCents: ratePerMileCents,
		TotalCostCents:   distanceMiles * ratePerMileCents,
	}, nil
}
