import { readObject, readString } from './primitives';

export type ReviewStatus = 'pending' | 'reviewed';

function readReviewStatus(value: unknown): ReviewStatus {
  const status = readString(value, 'review_status');

  if (status !== 'pending' && status !== 'reviewed') {
    throw new Error('review_status must be pending or reviewed');
  }

  return status;
}

export class ConfigurationChange {
  readonly id: string;
  readonly serviceName: string;
  readonly targetEnvironment: string;
  readonly fileName: string;
  readonly language: string;
  readonly beforeContent: string;
  readonly afterContent: string;
  readonly reviewStatus: ReviewStatus;

  constructor(value: unknown) {
    const record = readObject(value, 'ConfigurationChange');

    this.id = readString(record.change_id, 'change_id');
    this.serviceName = readString(record.service_name, 'service_name');
    this.targetEnvironment = readString(
      record.target_environment,
      'target_environment',
    );
    this.fileName = readString(record.file_name, 'file_name');
    this.language = readString(record.language, 'language');
    this.beforeContent = readString(record.before_content, 'before_content');
    this.afterContent = readString(record.after_content, 'after_content');
    this.reviewStatus = readReviewStatus(record.review_status);
  }
}
