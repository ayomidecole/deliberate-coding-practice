import { TrainingSession } from '../domain/training-session';

export async function getTrainingSession(sessionId: string): Promise<TrainingSession | null> {
  const response = await fetch(`/api/training-sessions/${sessionId}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Training session request failed with status ${response.status}`)
  }

  const body: unknown = await response.json()

  return new TrainingSession(body)
}
