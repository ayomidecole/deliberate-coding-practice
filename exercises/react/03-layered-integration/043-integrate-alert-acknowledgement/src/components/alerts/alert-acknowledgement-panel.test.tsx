// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ServiceAlert } from '../../domain/service-alert';
import { AlertAcknowledgementPanel } from './alert-acknowledgement-panel';

const SERVICE_ALERT_API_RECORD = {
  alert_id: 'alert-502',
  title: 'Payment timeout spike',
  service_name: 'payments-api',
  severity: 1,
};

afterEach(cleanup);

describe('AlertAcknowledgementPanel', () => {
  it.todo('renders one alert and reports the requested acknowledgement');
});
