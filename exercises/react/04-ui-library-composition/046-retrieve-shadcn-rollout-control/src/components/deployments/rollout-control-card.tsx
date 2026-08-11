import type { Deployment } from '../../domain/deployment';
import { Button } from '../ui/button';

export type RolloutControlCardProps = {
  readonly deployment: Deployment;
  readonly isPaused: boolean;
  readonly onPausedChange: (nextPaused: boolean) => void;
};

export function RolloutControlCard(_props: RolloutControlCardProps) {
  return null;
}
