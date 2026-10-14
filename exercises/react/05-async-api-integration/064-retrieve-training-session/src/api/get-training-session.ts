import { TrainingSession } from '../domain/training-session';

export async function getTrainingSession(sessionId: string): Promise<TrainingSession | null> {
  void sessionId;
  throw new Error('Training session client not implemented');
}
