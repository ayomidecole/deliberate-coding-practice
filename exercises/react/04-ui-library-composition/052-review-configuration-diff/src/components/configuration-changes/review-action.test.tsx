// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ReviewAction } from './review-action';

afterEach(cleanup);

describe('ReviewAction', () => {
  it('reports the review action while pending', () => {
    const onReview = vi.fn();

    render(<ReviewAction isReviewed={false} onReview={onReview} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mark as reviewed' }));

    expect(onReview).toHaveBeenCalledOnce();
  });
});
