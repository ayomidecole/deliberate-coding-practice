import { useState } from "react";

import { RatingPicker } from "../../components/feedback/rating-picker";

export function RateExperienceFeature() {
  const [currentRating, setCurrentRating] = useState(0);

  function handleRate(nextRating: number) {
    setCurrentRating(nextRating);
  }

  return (
    <RatingPicker currentRating={currentRating} onRate={handleRate} />
  );
}
