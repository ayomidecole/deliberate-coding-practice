import { ScoutingReport } from '../domain/scouting-report';

export async function getScoutingReport(reportId: string): Promise<ScoutingReport | null> {
  void reportId;
  throw new Error('Scouting report client not implemented');
}
