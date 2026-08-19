import type { DeploymentCheck } from '../../domain/deployment-rollback';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export type BlockingChecksTableProps = {
  readonly checks: readonly DeploymentCheck[];
};

export function BlockingChecksTable({ checks }: BlockingChecksTableProps) {
  return (
    <div className="checks-panel">
      <Table>
        <TableCaption>Deployment checks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Check</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checks.map((check) => (
            <TableRow key={check.id}>
              <TableCell>{check.name}</TableCell>
              <TableCell>{check.owner}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    check.status === 'failed' ? 'destructive' : 'secondary'
                  }
                >
                  {check.status === 'failed' ? 'Failed' : 'Passed'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
