// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';

afterEach(cleanup);

describe('Card infrastructure', () => {
  it('composes supplied header and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Example release</CardTitle>
          <CardDescription>Example target</CardDescription>
        </CardHeader>
        <CardContent>Example progress</CardContent>
      </Card>,
    );

    expect(screen.getByText('Example release')).toBeInTheDocument();
    expect(screen.getByText('Example target')).toBeInTheDocument();
    expect(screen.getByText('Example progress')).toBeInTheDocument();
  });
});
