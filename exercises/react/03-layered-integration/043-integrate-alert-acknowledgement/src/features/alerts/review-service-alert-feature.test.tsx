// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ServiceAlert } from '../../domain/service-alert';
import { ReviewServiceAlertFeature } from './review-service-alert-feature';

const SERVICE_ALERT_API_RECORD = {
  alert_id: 'alert-502',
  title: 'Payment timeout spike',
  service_name: 'payments-api',
  severity: 1,
};

afterEach(cleanup);

describe('ReviewServiceAlertFeature', () => {
  it.todo('acknowledges and reopens the service alert');
});
