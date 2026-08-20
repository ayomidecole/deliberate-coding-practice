import {
    readArray,
    readLiteral,
    readNumber,
    readObject,
    readString,
} from './primitives';

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';
export type PlayerAvailability = 'cleared' | 'review_required' | 'unavailable';

export class MatchdayPlayer {
    readonly id: string;
    readonly displayName: string;
    readonly shirtNumber: number;
    readonly position: PlayerPosition;
    readonly availability: PlayerAvailability;
    readonly medicalNote: string;

    constructor(value: unknown) {
        const matchdayPlayer = readObject(value, 'MatchdayPlayer');

        this.id = readString(matchdayPlayer.player_id, 'player_id');
        this.displayName = readString(
            matchdayPlayer.display_name,
            'display_name',
        );
        this.shirtNumber = readNumber(
            matchdayPlayer.shirt_number,
            'shirt_number',
        );
        this.position = readLiteral(
            matchdayPlayer.position,
            ['GK', 'DEF', 'MID', 'FWD'],
            'position',
        );

        this.availability = readLiteral(
            matchdayPlayer.availability,
            ['cleared', 'review_required', 'unavailable'],
            'availability',
        );
        this.medicalNote = readString(
            matchdayPlayer.medical_note,
            'medical_note',
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
        const matchdaySquad = readObject(value, 'MatchdaySquad');

        this.fixtureId = readString(matchdaySquad.fixture_id, 'fixture_id');
        this.teamName = readString(matchdaySquad.team_name, 'team_name');
        this.opponentName = readString(
            matchdaySquad.opponent_name,
            'opponent_name',
        );
        this.competition = readString(matchdaySquad.competition, 'competition');
        this.kickoffLabel = readString(
            matchdaySquad.kickoff_label,
            'kickoff_label',
        );
        this.players = readArray(
            matchdaySquad.players,
            'players',
            (item) => new MatchdayPlayer(item),
        );
    }
}
