import { MatchReport } from '../domain/match-report';

export async function getMatchReport(matchId: string): Promise<MatchReport | null> {
  const response = await fetch(`/api/match-reports/${matchId}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Match report request failed with status ${response.status}`)
  } else {
    const body:unknown = await response.json()
    return new MatchReport(body)
  }

}
