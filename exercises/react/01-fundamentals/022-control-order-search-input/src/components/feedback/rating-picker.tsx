export type RatingPickerProps = {
  readonly currentRating: number;
  readonly onRate: (rating: number) => void;
};

export function RatingPicker({
  currentRating,
  onRate,
}: RatingPickerProps) {
  function handleRateOne() {
    onRate(1);
  }

  function handleRateTwo() {
    onRate(2);
  }

  return (
    <div>
      <p>Current rating: {currentRating}</p>
      <button type="button" onClick={handleRateOne}>
        Rate 1
      </button>
      <button type="button" onClick={handleRateTwo}>
        Rate 2
      </button>
    </div>
  );
}
