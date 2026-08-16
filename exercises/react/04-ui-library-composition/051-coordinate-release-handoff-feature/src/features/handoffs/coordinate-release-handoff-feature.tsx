import { useState } from 'react';

import { HandoffChannelPanel } from '../../components/handoffs/handoff-channel-panel';
import { HandoffSubmitControl } from '../../components/handoffs/handoff-submit-control';
import { ReleaseHandoffCard } from '../../components/handoffs/release-handoff-card';
import type { ReleaseHandoff } from '../../domain/release-handoff';

export type CoordinateReleaseHandoffFeatureProps = {
  readonly release: ReleaseHandoff;
};

export function CoordinateReleaseHandoffFeature({
  release,
}: CoordinateReleaseHandoffFeatureProps) {
  return (
    <section
      className="feature-stack"
      aria-labelledby="release-handoff-heading"
    >
      <h2 id="release-handoff-heading">Coordinate release handoff</h2>
    </section>
  );
}
