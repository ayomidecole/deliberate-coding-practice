import type { ConfigurationChange } from '../../domain/configuration-change';

export type ReviewConfigurationDiffFeatureProps = {
  readonly change: ConfigurationChange;
};

export function ReviewConfigurationDiffFeature({
  change,
}: ReviewConfigurationDiffFeatureProps) {
  void change;

  return (
    <section
      className="feature-stack"
      aria-labelledby="configuration-review-heading"
    >
      <h2 id="configuration-review-heading">Review configuration change</h2>
    </section>
  );
}
