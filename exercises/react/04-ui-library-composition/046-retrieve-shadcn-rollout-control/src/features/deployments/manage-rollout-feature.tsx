import { useState } from 'react';
import { RolloutControlCard } from '../../components/deployments/rollout-control-card';
import type { Deployment } from '../../domain/deployment';

export type ManageRolloutFeatureProps = {
    readonly deployment: Deployment;
};

export function ManageRolloutFeature({
    deployment,
}: ManageRolloutFeatureProps) {
    const [paused, setPaused] = useState(deployment.rolloutPaused);

    const handlePause = (nextPaused: boolean) => {
        setPaused(nextPaused);
    };
    return (
        <section
            className="feature-stack"
            aria-labelledby="rollout-control-heading"
        >
            <h2 id="rollout-control-heading">Control production rollout</h2>
            <RolloutControlCard
                deployment={deployment}
                isPaused={paused}
                onPausedChange={handlePause}
            />
        </section>
    );
}
