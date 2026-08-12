// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Deployment } from '../../domain/deployment';
import { DeploymentRunbookField } from './deployment-runbook-field';

const DEPLOYMENT = new Deployment({
  deployment_id: 'deployment-882',
  service_name: 'Identity API',
  target_environment: 'Production',
  runbook_url: 'https://runbooks.example.com/identity',
});

afterEach(cleanup);

describe('DeploymentRunbookField', () => {
  it('reports an edit through the controlled shadcn Input', () => {
    const onRunbookUrlChange = vi.fn();

    render(
      <DeploymentRunbookField
        deployment={DEPLOYMENT}
        draftRunbookUrl="https://runbooks.example.com/identity-v2"
        hasUnsavedChanges={true}
        onRunbookUrlChange={onRunbookUrlChange}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Runbook URL' });

    expect(input).toHaveValue('https://runbooks.example.com/identity-v2');
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();

    fireEvent.change(input, {
      target: { value: 'https://runbooks.example.com/identity-v3' },
    });

    expect(onRunbookUrlChange).toHaveBeenCalledTimes(1);
  });
});
