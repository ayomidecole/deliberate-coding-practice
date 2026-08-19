import type { DeploymentRollback } from '../../domain/deployment-rollback';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

export type RollbackPlanSheetProps = {
  readonly deployment: DeploymentRollback;
  readonly open: boolean;
  readonly rollbackStarted: boolean;
  readonly onOpenChange: (nextOpen: boolean) => void;
  readonly onStartRollback: () => void;
};

export function RollbackPlanSheet({
  deployment,
  open,
  rollbackStarted,
  onOpenChange,
  onStartRollback,
}: RollbackPlanSheetProps) {
  return <Sheet />;
}
