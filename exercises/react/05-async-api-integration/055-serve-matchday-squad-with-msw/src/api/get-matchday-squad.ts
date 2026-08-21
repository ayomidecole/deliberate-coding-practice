import { MatchdaySquad } from '../domain/matchday-squad';

export type GetMatchdaySquadResult =
  | { readonly status: 'found'; readonly squad: MatchdaySquad }
  | { readonly status: 'not-found' };

export async function getMatchdaySquad(
  fixtureId: string,
): Promise<GetMatchdaySquadResult> {
  const response = await fetch(`/api/matchday-squads/${fixtureId}`);

  if (response.status === 404) {
    return { status: 'not-found' };
  }

  if (!response.ok) {
    throw new Error(`Squad request failed with status ${response.status}`);
  }

  const body: unknown = await response.json();

  return {
    status: 'found',
    squad: new MatchdaySquad(body),
  };
}
