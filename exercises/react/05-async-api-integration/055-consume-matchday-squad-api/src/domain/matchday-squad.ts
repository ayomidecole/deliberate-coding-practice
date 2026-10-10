import {
  readArray,
  readLiteral,
  readNumber,
  readObject,
  readString,
} from './primitives';

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';
export type PlayerAvailability =
  | 'cleared'
  | 'review_required'
  | 'unavailable';

export class MatchdayPlayer {
  readonly id: string;
  readonly displayName: string;
  readonly shirtNumber: number;
  readonly position: PlayerPosition;
  readonly availability: PlayerAvailability;

  constructor(value: unknown) {
    const player = readObject(value, 'MatchdayPlayer');

    this.id = readString(player.player_id, 'player_id');
    this.displayName = readString(player.display_name, 'display_name');
    this.shirtNumber = readNumber(player.shirt_number, 'shirt_number');
    this.position = readLiteral(
      player.position,
      ['GK', 'DEF', 'MID', 'FWD'],
      'position',
    );
    this.availability = readLiteral(
      player.availability,
      ['cleared', 'review_required', 'unavailable'],
      'availability',
    );
  }
}

export class MatchdaySquad {
  readonly fixtureId: string;
  readonly teamName: string;
  readonly opponentName: string;
  readonly competition: string;
  readonly kickoffLabel: string;
  readonly players: readonly MatchdayPlayer[];

  constructor(value: unknown) {
    const squad = readObject(value, 'MatchdaySquad');

    this.fixtureId = readString(squad.fixture_id, 'fixture_id');
    this.teamName = readString(squad.team_name, 'team_name');
    this.opponentName = readString(squad.opponent_name, 'opponent_name');
    this.competition = readString(squad.competition, 'competition');
    this.kickoffLabel = readString(squad.kickoff_label, 'kickoff_label');
    this.players = readArray(
      squad.players,
      'players',
      (item) => new MatchdayPlayer(item),
    );
  }
}
