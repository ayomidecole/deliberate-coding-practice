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
  const [handoffChannel, setHandoffChannel] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(release.handoffStatus === 'sent');

  const hasChannel = handoffChannel !== null;
  const canSend = hasChannel && !isSent;

  const handleChannelChange = (nextValue: string | null) => {
    setHandoffChannel(nextValue);
  };

  const handleSend = () => {
    setIsSent(true);
  };

  return (
    <section
      className="feature-stack"
      aria-labelledby="release-handoff-heading"
    >
      <h2 id="release-handoff-heading">Coordinate release handoff</h2>
      <ReleaseHandoffCard
        release={release}
        handoffChannel={handoffChannel}
        isSent={isSent}
      />
      <HandoffChannelPanel
        value={handoffChannel}
        disabled={isSent}
        isSent={isSent}
        onValueChange={handleChannelChange}
      />
      <HandoffSubmitControl
        isSent={isSent}
        canSend={canSend}
        onSend={handleSend}
      />
    </section>
  );
}