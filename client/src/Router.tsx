import { Switch, Route } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { Landing } from '@/pages/Landing';
import { Dashboard } from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import PriceLists from '@/pages/PriceLists';
import Profile from '@/pages/Profile';
import InfrastructureDashboardComponent from '@/pages/InfrastructureDashboard';
import DocumentBridgePage from '@/pages/DocumentBridge';
import Reports from '@/pages/Reports';
import MCPDashboard from '@/pages/MCPDashboard';
import DocumentSync from '@/pages/DocumentSync';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Placeholder components for remaining pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">
        This page is ready for implementation in upcoming patches.
      </p>
    </div>
    <div className="text-center py-12 bg-muted/50 rounded-lg">
      <div className="w-16 h-16 divine-gradient rounded-full mx-auto mb-4"></div>
      <p className="text-lg font-medium mb-2">{title} Coming Soon</p>
      <p className="text-sm text-muted-foreground">
        Foundation infrastructure is ready. Business logic will be added in specialized patches.
      </p>
    </div>
  </div>
);

// Placeholder pages ready for implementation
const POS = () => <PlaceholderPage title="Point of Sale" />;
const Products = () => <PlaceholderPage title="Products" />;
const Orders = () => <PlaceholderPage title="Orders" />;
const Suppliers = () => <PlaceholderPage title="Suppliers" />;
const Settings = () => <PlaceholderPage title="Settings" />;
const PurchaseOrders = () => <PlaceholderPage title="Purchase Orders" />;
const SupplierInvoices = () => <PlaceholderPage title="Supplier Invoices" />;
const Passports = () => <PlaceholderPage title="Order Passports" />;
const DailyBalance = () => <PlaceholderPage title="Daily Balance" />;
const Expenses = () => <PlaceholderPage title="Expense Management" />;
const Banking = () => <PlaceholderPage title="Banking" />;
const VATReturns = () => <PlaceholderPage title="VAT Returns" />;
const Accounts = () => <PlaceholderPage title="Accounts" />;
const WarehouseManagement = () => <PlaceholderPage title="Warehouse Management" />;
const Inventory = () => <PlaceholderPage title="Inventory" />;
const DeliveryScheduler = () => <PlaceholderPage title="Delivery Scheduler" />;
const GoodsReceipt = () => <PlaceholderPage title="Goods Receipt" />;
const StockMovement = () => <PlaceholderPage title="Stock Movement" />;
const MorpheusInbox = () => <PlaceholderPage title="Morpheus Inbox" />;
const XeroSyncHealth = () => <PlaceholderPage title="Xero Sync Health" />;
const ECommerce = () => <PlaceholderPage title="eCommerce" />;
const AIArea = () => <PlaceholderPage title="AI Area" />;
const Communications = () => <PlaceholderPage title="Communications" />;
const Vault = () => <PlaceholderPage title="Vault" />;
const PatchLog = () => <PlaceholderPage title="Patch Log" />;

export function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/customers" component={Customers} />
        <Route path="/products" component={Products} />
        <Route path="/orders" component={Orders} />
        <Route path="/suppliers" component={Suppliers} />
        <Route path="/settings" component={Settings} />
        <Route path="/mcp-dashboard" component={MCPDashboard} />
        <Route path="/document-sync" component={DocumentSync} />
        
        {/* Placeholder pages ready for implementation */}
        <Route path="/pos" component={POS} />
        <Route path="/purchase-orders" component={PurchaseOrders} />
        <Route path="/supplier-invoices" component={SupplierInvoices} />
        <Route path="/passports" component={Passports} />
        <Route path="/price-list-review" component={() => <PriceLists />} />
        <Route path="/daily-balance" component={DailyBalance} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/banking" component={Banking} />
        <Route path="/vat-returns" component={VATReturns} />
        <Route path="/accounts" component={Accounts} />
        <Route path="/warehouse" component={WarehouseManagement} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/delivery-scheduler" component={DeliveryScheduler} />
        <Route path="/goods-receipt" component={GoodsReceipt} />
        <Route path="/stock-movement" component={StockMovement} />
        <Route path="/morpheus-inbox" component={MorpheusInbox} />
        <Route path="/xero-sync-health" component={XeroSyncHealth} />
        <Route path="/infrastructure-dashboard" component={() => <InfrastructureDashboardComponent />} />
        <Route path="/reports" component={() => <Reports />} />
        <Route path="/ecommerce" component={ECommerce} />
        <Route path="/ai-area" component={AIArea} />
        <Route path="/communications" component={Communications} />
        <Route path="/vault" component={Vault} />
        <Route path="/patch-log" component={PatchLog} />
        <Route path="/profile" component={Profile} />
        
        <Route>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground">
              The requested page could not be found.
            </p>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}
