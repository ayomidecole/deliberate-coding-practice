import type { Deployment } from '../../domain/deployment';
import { Button } from '../ui/button';

export type RolloutControlCardProps = {
  readonly deployment: Deployment;
  readonly isPaused: boolean;
  readonly onPausedChange: (nextPaused: boolean) => void;
};

export function RolloutControlCard({deployment, isPaused, onPausedChange}: RolloutControlCardProps) {
  return (
    <article className='rollout-card'>
      <h3>{deployment.serviceName}</h3>
      <p>Target: {deployment.targetEnvironment}</p>
      <p className='rollout-status'>
        {isPaused? "Rollout status: Paused": "Rollout status: Active"}
      </p>
      <Button
        type='button'
        onClick={() => onPausedChange(!isPaused)}
      >
        {isPaused? "Resume rollout": "Pause rollout"}
      </Button>
    </article>
  );
}
