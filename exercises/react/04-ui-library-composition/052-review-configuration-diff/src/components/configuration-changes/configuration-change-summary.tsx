import type { ConfigurationChange } from '../../domain/configuration-change';
import { Badge } from '../ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

export type ConfigurationChangeSummaryProps = {
  readonly change: ConfigurationChange;
  readonly isReviewed: boolean;
};

export function ConfigurationChangeSummary({
  change,
  isReviewed,
}: ConfigurationChangeSummaryProps) {
  return (
    <article className="configuration-summary">
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>{change.serviceName}</h3>
          </CardTitle>
          <CardDescription>
            Target: {change.targetEnvironment}
          </CardDescription>
          <CardAction>
            <Badge variant={isReviewed ? 'default' : 'outline'}>
              {isReviewed ? 'Reviewed' : 'Review pending'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>File: {change.fileName}</p>
        </CardContent>
      </Card>
    </article>
  );
}
