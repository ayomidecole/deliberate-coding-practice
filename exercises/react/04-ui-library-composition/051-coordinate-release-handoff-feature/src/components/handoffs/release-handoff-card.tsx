import type { ReleaseHandoff } from '../../domain/release-handoff';
import { Badge } from '../ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

export type ReleaseHandoffCardProps = {
  readonly release: ReleaseHandoff;
  readonly handoffChannel: string | null;
  readonly isSent: boolean;
};

export function ReleaseHandoffCard({
  release,
  handoffChannel,
  isSent,
}: ReleaseHandoffCardProps) {
  const hasChannel = handoffChannel !== null;
  const channelPreview = handoffChannel ?? 'Not selected';

  let statusText = 'Channel required';
  let badgeVariant: 'default' | 'secondary' | 'outline' = 'outline';

  if (isSent) {
    statusText = 'Handoff sent';
    badgeVariant = 'default';
  } else if (hasChannel) {
    statusText = 'Ready to send';
    badgeVariant = 'secondary';
  }

  return (
    <article className="handoff-card">
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>{release.serviceName}</h3>
          </CardTitle>
          <CardDescription>
            Target: {release.targetEnvironment}
          </CardDescription>
          <CardAction>
            <Badge variant={badgeVariant}>{statusText}</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Owner: {release.ownerName}</p>
          <p>Handoff channel: {channelPreview}</p>
        </CardContent>
      </Card>
    </article>
  );
}
