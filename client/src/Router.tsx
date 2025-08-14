import { Switch, Route } from 'wouter';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';

export function Router() {
  // Skip authentication for testing - direct dashboard
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground">
              This page will be implemented in the next bootstrap phase.
            </p>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}
