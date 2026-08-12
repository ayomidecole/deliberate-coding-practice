import type { ChangeEvent } from 'react';

import type { Deployment } from '../../domain/deployment';
import { Input } from '../ui/input';

export type DeploymentRunbookFieldProps = {
    readonly deployment: Deployment;
    readonly draftRunbookUrl: string;
    readonly hasUnsavedChanges: boolean;
    readonly onRunbookUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function DeploymentRunbookField({
    deployment,
    draftRunbookUrl,
    hasUnsavedChanges,
    onRunbookUrlChange,
}: DeploymentRunbookFieldProps) {
  return (
    <article className='runbook-card'>
      <h3>{deployment.serviceName}</h3>
      <p>Target: {deployment.targetEnvironment}</p>
      <p>Saved runbook: {deployment.runbookUrl}</p>
      <label htmlFor="runbook-url">Runbook URL</label>
      <Input
        id='runbook-url'
        type='url'
        value={draftRunbookUrl}
        onChange={onRunbookUrlChange}
      />
      <p className='draft-status'>
        {hasUnsavedChanges? 'Unsaved changes':'No unsaved changes'}
      </p>
      </article>
    );
}
