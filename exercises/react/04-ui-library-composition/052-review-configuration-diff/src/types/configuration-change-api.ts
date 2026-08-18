export type ConfigurationChangeApiRecord = {
  readonly change_id: string;
  readonly service_name: string;
  readonly target_environment: string;
  readonly file_name: string;
  readonly language: string;
  readonly before_content: string;
  readonly after_content: string;
  readonly review_status: 'pending' | 'reviewed';
};
