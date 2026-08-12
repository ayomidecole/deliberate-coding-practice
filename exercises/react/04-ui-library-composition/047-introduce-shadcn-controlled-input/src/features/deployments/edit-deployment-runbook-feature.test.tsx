// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Deployment } from '../../domain/deployment';
import { EditDeploymentRunbookFeature } from './edit-deployment-runbook-feature';

const DEPLOYMENT = new Deployment({
  deployment_id: 'deployment-882',
  service_name: 'Identity API',
  target_environment: 'Production',
  runbook_url: 'https://runbooks.example.com/identity',
});

afterEach(cleanup);

describe('EditDeploymentRunbookFeature', () => {
  it('stores a runbook URL draft without mutating the domain object', () => {
    render(<EditDeploymentRunbookFeature deployment={DEPLOYMENT} />);

    const input = screen.getByRole('textbox', { name: 'Runbook URL' });

    expect(input).toHaveValue('https://runbooks.example.com/identity');
    expect(screen.getByText('No unsaved changes')).toBeInTheDocument();

    fireEvent.change(input, {
      target: { value: 'https://runbooks.example.com/identity-v2' },
    });

    expect(input).toHaveValue('https://runbooks.example.com/identity-v2');
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(screen.queryByText('No unsaved changes')).not.toBeInTheDocument();
    expect(DEPLOYMENT.runbookUrl).toBe('https://runbooks.example.com/identity');
  });
});
