import type { ReleaseCandidate } from '../../domain/release-candidate';
import { Badge } from '../ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';

export type ReleaseReadinessCardProps = {
  readonly release: ReleaseCandidate;
  readonly isApproved: boolean;
};

export function ReleaseReadinessCard({
  release,
  isApproved,
}: ReleaseReadinessCardProps) {
  const verificationPercentage = Math.round(
    (release.completedChecks / release.totalChecks) * 100,
  );

  const checkComplete = release.completedChecks === release.totalChecks;

  let statusText = 'Checks incomplete';
  let badgeVariant: 'default' | 'secondary' | 'outline' = 'outline';

  if (isApproved) {
    statusText = 'Approved';
    badgeVariant = 'default';
  } else if (checkComplete) {
    statusText = 'Ready for approval';
    badgeVariant = 'secondary';
  }

  return (
    <article className="release-card">
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
          <p>
            {release.completedChecks} of {release.totalChecks} checks complete
          </p>
          <Progress
            value={verificationPercentage}
            aria-label={`${release.serviceName} readiness`}
          />
        </CardContent>
      </Card>
    </article>
  );
}
