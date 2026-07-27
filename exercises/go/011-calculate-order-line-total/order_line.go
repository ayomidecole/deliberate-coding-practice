package orderline

type OrderLine struct {
	SKU            string
	UnitPriceCents int
	Quantity       int
}

func CalculateLineTotalCents(line OrderLine) int {

	total := line.UnitPriceCents * line.Quantity

	return total
}
