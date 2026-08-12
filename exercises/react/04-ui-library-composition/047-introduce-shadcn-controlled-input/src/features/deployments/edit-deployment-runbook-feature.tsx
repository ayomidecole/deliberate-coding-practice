import { DeploymentRunbookField } from '../../components/deployments/deployment-runbook-field';
import type { Deployment } from '../../domain/deployment';
import {useState, type ChangeEvent } from 'react';


export type EditDeploymentRunbookFeatureProps = {
  readonly deployment: Deployment;
};

export function EditDeploymentRunbookFeature(
  {deployment}: EditDeploymentRunbookFeatureProps,
) {
  const [draftRunbookUrl, setDraftRunbookUrl] = useState(deployment.runbookUrl)

  const handleRunbookUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftRunbookUrl(event.currentTarget.value)
  }

  const hasUnsavedChanges = draftRunbookUrl !== deployment.runbookUrl

  return (
    <section className='feature-stack' aria-labelledby='runbook-editor-heading'>
      <h2 id='runbook-editor-heading'>Edit deployment runbook</h2>
      <DeploymentRunbookField
        deployment={deployment}
        draftRunbookUrl={draftRunbookUrl}
        hasUnsavedChanges={hasUnsavedChanges}
        onRunbookUrlChange={handleRunbookUrlChange}
      />
    </section>
  );
}
