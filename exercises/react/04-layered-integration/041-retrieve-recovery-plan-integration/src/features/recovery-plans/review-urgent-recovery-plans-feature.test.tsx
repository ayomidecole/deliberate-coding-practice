// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { RecoveryPlan } from '../../domain/recovery-plan';
import { ReviewUrgentRecoveryPlansFeature } from './review-urgent-recovery-plans-feature';

const RECOVERY_PLAN_API_RECORDS = [
  {
    plan_id: 'plan-checkout',
    service_name: 'Checkout API',
    dependencies: ['payments', 'inventory'],
    owner_teams: ['commerce-platform', 'payments'],
    recovery_target_minutes: 15,
  },
  {
    plan_id: 'plan-reporting',
    service_name: 'Analytics reporting',
    dependencies: ['data-warehouse'],
    owner_teams: ['analytics'],
    recovery_target_minutes: 90,
  },
  {
    plan_id: 'plan-identity',
    service_name: 'Identity provider',
    dependencies: ['directory', 'audit-log'],
    owner_teams: ['identity-platform', 'security'],
    recovery_target_minutes: 30,
  },
];

function renderFeature() {
  const plans = RECOVERY_PLAN_API_RECORDS.map((record) => {
    return new RecoveryPlan(record);
  });

  render(
    <ReviewUrgentRecoveryPlansFeature
      plans={plans}
      maximumRecoveryMinutes={30}
    />,
  );
}

afterEach(cleanup);

describe('ReviewUrgentRecoveryPlansFeature', () => {
  it('renders the urgent recovery-plan review section', () => {
    renderFeature();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Recovery plans requiring urgent review',
      }),
    ).toBeTruthy();
  });

  it('shows only recovery plans with a recovery target of 30 minutes or less as urgent', () => {
    renderFeature();

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Checkout API' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Identity provider' }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: 'Analytics reporting',
      }),
    ).not.toBeInTheDocument();

    expect(screen.getAllByText('payments')).toHaveLength(2);
    expect(screen.getByText('security')).toBeInTheDocument();
  });
});
