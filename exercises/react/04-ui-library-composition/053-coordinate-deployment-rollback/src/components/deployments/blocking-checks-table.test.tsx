// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DeploymentCheck } from '../../domain/deployment-rollback';
import { BlockingChecksTable } from './blocking-checks-table';

afterEach(cleanup);

describe('BlockingChecksTable', () => {
  it('renders check ownership and result in a table row', () => {
    const check = new DeploymentCheck({
      check_id: 'check-error-rate',
      check_name: 'Error-rate budget',
      owner: 'Checkout team',
      status: 'failed',
    });

    render(<BlockingChecksTable checks={[check]} />);

    const row = screen.getByRole('row', { name: /Error-rate budget/ });
    expect(row).toHaveTextContent('Checkout team');
    expect(row).toHaveTextContent('Failed');
  });
});
