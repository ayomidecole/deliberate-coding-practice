import type { ReleaseGate } from '../../domain/release-gate';

export type ReleaseGateResultsProps = {
    readonly gates: readonly ReleaseGate[];
};

export function ReleaseGateResults({ gates }: ReleaseGateResultsProps) {
    return (
        <div>
            {gates.map((gate) => {
                const headingId = `release-gate-${gate.id}-heading`;

                return (
                    <article key={gate.id} aria-labelledby={headingId}>
                        <h3 id={headingId}>{gate.name}</h3>
                        <p>Minimum approvals: {gate.minimumApprovals}</p>
                        <ul aria-label={`${gate.name} environments`}>
                            {gate.environments.map((environment) => (
                                <li key={environment}>{environment}</li>
                            ))}
                        </ul>
                        <ul aria-label={`${gate.name} required teams`}>
                            {gate.requiredTeams.map((team) => (
                                <li key={team}>{team}</li>
                            ))}
                        </ul>
                    </article>
                );
            })}
        </div>
    );
}
