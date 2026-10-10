import { PlayerAvailability } from '../domain/player-availability';

export async function getPlayerAvailability(
  playerId: string,
): Promise<PlayerAvailability | null> {
  const response = await fetch(`/api/player-availability/${playerId}`);

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Availability request failed with status ${response.status}`)
  }

  const body: unknown = await response.json();

  return new PlayerAvailability(body);
}
