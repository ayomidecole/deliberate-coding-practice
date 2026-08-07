export type HttpClient = {
  readonly get: (path: string) => Promise<unknown>;
};
