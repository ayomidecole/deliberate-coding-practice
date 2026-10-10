import { PlayerAvailability } from '../domain/player-availability';

export async function getPlayerAvailability(
  playerId: string,
): Promise<PlayerAvailability | null> {
  const response = await fetch(`/api/player-availability/${playerId}`);

  void response;
  throw new Error('Player availability client not implemented');
}
