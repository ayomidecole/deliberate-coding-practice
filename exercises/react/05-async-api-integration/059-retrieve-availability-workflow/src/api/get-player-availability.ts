import { PlayerAvailability } from '../domain/player-availability';

export async function getPlayerAvailability(
  playerId: string,
): Promise<PlayerAvailability | null> {
  void playerId;
  throw new Error('API client not implemented');
}
