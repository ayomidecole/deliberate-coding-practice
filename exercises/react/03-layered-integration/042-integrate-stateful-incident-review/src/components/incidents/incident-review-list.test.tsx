// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Incident } from '../../domain/incident';
import { IncidentReviewList } from './incident-review-list';

const INCIDENT_API_RECORDS = [
    {
        incident_id: 'inc-204',
        summary: 'Checkout latency',
        affected_services: ['checkout-api', 'payments'],
        severity: 2,
    },
    {
        incident_id: 'inc-309',
        summary: 'Identity outage',
        affected_services: ['identity-provider', 'admin-console'],
        severity: 1,
    },
];

afterEach(cleanup);

describe('IncidentReviewList', () => {
    it('renders incidents and reports the selected incident ID', () => {
        const onIncidentSelect = vi.fn();
        const incidents = INCIDENT_API_RECORDS.map(
            (record) => new Incident(record),
        );

        render(
            <IncidentReviewList
                incidents={incidents}
                onIncidentSelect={onIncidentSelect}
            />,
        );

        expect(screen.getAllByRole('article')).toHaveLength(2);

        fireEvent.click(
            screen.getByRole('button', { name: 'Review Checkout latency' }),
        );

        expect(onIncidentSelect).toHaveBeenCalledTimes(1);
        expect(onIncidentSelect).toHaveBeenCalledWith('inc-204');
    });
});
