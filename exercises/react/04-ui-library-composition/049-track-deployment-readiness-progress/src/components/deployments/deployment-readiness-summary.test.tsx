// @vitest-environment jsdom

import { cleanup } from '@testing-library/react';
import { afterEach, describe, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DeploymentChecklist } from '../../domain/deployment-checklist';

const DEPLOYMENT = new DeploymentChecklist({
  deployment_id: 'deployment-billing-v4',
  service_name: 'Billing API',
  completed_checks: 2,
  total_checks: 4,
});

afterEach(cleanup);

describe('DeploymentReadinessSummary', () => {
  it.todo('presents the current checklist progress');
});

void DEPLOYMENT;
