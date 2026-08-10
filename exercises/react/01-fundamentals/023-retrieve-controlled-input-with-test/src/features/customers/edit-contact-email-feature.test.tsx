// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { EditContactEmailFeature } from './edit-contact-email-feature';

afterEach(cleanup);

describe('EditContactEmailFeature', () => {
    it('starts with an empty controlled field and initial guidance', () => {
        render(<EditContactEmailFeature />);

        const input = screen.getByRole('textbox', {
            name: 'Contact email',
        }) as HTMLInputElement;

        expect(input.value).toBe('');
        expect(screen.getByText('No contact email entered.')).toBeTruthy();
    });

    it('stores the input edit and returns it through the component', () => {
        render(<EditContactEmailFeature />);

        const input = screen.getByRole('textbox', {
            name: 'Contact email',
        }) as HTMLInputElement;

        fireEvent.change(input, {
            target: {
                value: 'mmm@aa.com',
            },
        });

        fireEvent.change(input, {
            target: {
                value: 'aaa@aa.com',
            },
        });
        expect(input.value).toBe('aaa@aa.com');
        expect(screen.getByText('Draft email: aaa@aa.com')).toBeTruthy();
        expect(screen.queryByText('Draft email: mmm@aa.com')).toBeNull();
    });
});
