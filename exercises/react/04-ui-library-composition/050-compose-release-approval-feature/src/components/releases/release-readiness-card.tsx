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

export function ReleaseReadinessCard(_props: ReleaseReadinessCardProps) {
  return null;
}
