export type PlayerAvailabilityApiRecord = {
  readonly player_id: string;
  readonly display_name: string;
  readonly availability: 'cleared' | 'review_required' | 'unavailable';
  readonly medical_note: string;
};
