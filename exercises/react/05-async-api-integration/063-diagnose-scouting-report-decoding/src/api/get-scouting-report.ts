import { ScoutingReport } from '../domain/scouting-report';

export async function getScoutingReport(reportId: string): Promise<ScoutingReport | null> {
  const response = await fetch(`/api/scouting-reports/${reportId}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Scouting report request failed with status ${response.status}`);
  }

  const body: unknown = await response.json()
  
  return new ScoutingReport(response)
}
