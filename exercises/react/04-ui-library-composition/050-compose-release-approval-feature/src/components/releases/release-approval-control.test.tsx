// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ReleaseApprovalControl } from './release-approval-control';

afterEach(cleanup);

describe('ReleaseApprovalControl', () => {
  it('reports an available approval action', () => {
    const onApprove = vi.fn();

    render(
      <ReleaseApprovalControl
        isApproved={false}
        canApprove={true}
        onApprove={onApprove}
      />,
    );

    const button = screen.getByRole('button', { name: 'Approve release' });
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(onApprove).toHaveBeenCalledOnce();
  });
});
