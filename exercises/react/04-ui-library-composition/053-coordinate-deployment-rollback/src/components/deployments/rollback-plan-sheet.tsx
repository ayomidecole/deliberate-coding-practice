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
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger
                render={
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={rollbackStarted}
                    />
                }
            >
                {rollbackStarted ? 'Rollback started' : 'Review rollback plan'}
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>
                        Rollback plan for {deployment.serviceName}
                    </SheetTitle>
                    <SheetDescription>
                        Review the recovery sequence before starting the
                        rollback.
                    </SheetDescription>
                </SheetHeader>
                <ol className="rollback-steps">
                    {deployment.rollbackSteps.map((step) => (
                        <li key={step}>{step}</li>
                    ))}
                </ol>
                <SheetFooter>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onStartRollback}
                        disabled={rollbackStarted}
                    >
                        Start rollback
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
