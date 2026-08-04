import { useState } from "react";

import { RatingPicker } from "../../components/feedback/rating-picker";

export function RateExperienceFeature() {
  const [rating, setRating] = useState(0)

  function changeRating(nextRating: number) {
    setRating(nextRating)
  }
  return <RatingPicker currentRating={rating} onRate={changeRating}/>;
}
