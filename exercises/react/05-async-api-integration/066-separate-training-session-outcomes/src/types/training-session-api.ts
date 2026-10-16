export type TrainingSessionApiRecord = {
  readonly session_id: string;
  readonly title: string;
  readonly focus: 'technical' | 'tactical' | 'fitness';
  readonly summary: string;
};
