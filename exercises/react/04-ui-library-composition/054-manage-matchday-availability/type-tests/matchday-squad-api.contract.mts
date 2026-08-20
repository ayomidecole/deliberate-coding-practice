import type {
  MatchdayPlayerApiRecord,
  MatchdaySquadApiRecord,
} from '../src/types/matchday-squad-api';

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;

type Expect<Value extends true> = Value;

type ExpectedMatchdayPlayerApiRecord = {
  readonly player_id: string;
  readonly display_name: string;
  readonly shirt_number: number;
  readonly position: 'GK' | 'DEF' | 'MID' | 'FWD';
  readonly availability: 'cleared' | 'review_required' | 'unavailable';
  readonly medical_note: string;
};

type ExpectedMatchdaySquadApiRecord = {
  readonly fixture_id: string;
  readonly team_name: string;
  readonly opponent_name: string;
  readonly competition: string;
  readonly kickoff_label: string;
  readonly players: readonly MatchdayPlayerApiRecord[];
};

type PlayerContractMatches = Expect<
  Equal<MatchdayPlayerApiRecord, ExpectedMatchdayPlayerApiRecord>
>;

type SquadContractMatches = Expect<
  Equal<MatchdaySquadApiRecord, ExpectedMatchdaySquadApiRecord>
>;
