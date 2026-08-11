import { ReviewDeploymentFeature } from '../features/deployments/review-deployment-feature';

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Release operations</p>
      <h1>Approval console</h1>
      <ReviewDeploymentFeature />
    </main>
  );
}
