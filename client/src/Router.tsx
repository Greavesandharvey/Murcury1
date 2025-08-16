import { Switch, Route } from 'wouter';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Landing } from '@/pages/Landing';
import Customers from '@/pages/Customers';
import PriceLists from '@/pages/PriceLists';
import Profile from '@/pages/Profile';
import InfrastructureDashboardComponent from '@/pages/InfrastructureDashboard';
import DocumentBridgePage from '@/pages/DocumentBridge';
import Reports from '@/pages/Reports';

// Placeholder component for routes not yet implemented
const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="glass-card p-6">
    <h2 className="text-2xl font-bold divine-gradient-text mb-4">{name}</h2>
    <p className="text-slate-400 mb-4">
      This page will be implemented in the next bootstrap phase.
    </p>
    <div className="border border-slate-700/50 bg-slate-800/50 rounded-lg p-4 text-slate-400">
      <p>This is a placeholder for the {name} page. The UI layout is locked according to MercuryOne UI Lock Protocol.</p>
      <p className="mt-2">Future patches will implement backend functionality while preserving the divine theme.</p>
    </div>
  </div>
);

// POS Page
const POS = () => <PlaceholderPage name="Point of Sale" />;

// Products Page
const Products = () => <PlaceholderPage name="Products" />;

// Settings Page
const Settings = () => <PlaceholderPage name="Settings" />;

// Essential Section Routes
const Orders = () => <PlaceholderPage name="Orders" />;

// Business Section Routes
const Suppliers = () => <PlaceholderPage name="Suppliers" />;
const PurchaseOrders = () => <PlaceholderPage name="Purchase Orders" />;
const SupplierInvoices = () => <PlaceholderPage name="Supplier Invoices" />;
const Passports = () => <PlaceholderPage name="Passports" />;
const PriceListReview = () => <PriceLists />;

// Finance Section Routes
const DailyBalance = () => <PlaceholderPage name="Daily Balance" />;
const Expenses = () => <PlaceholderPage name="Expenses" />;
const Banking = () => <PlaceholderPage name="Banking" />;
const VATReturns = () => <PlaceholderPage name="VAT Returns" />;
const Accounts = () => <PlaceholderPage name="Accounts" />;

// Warehouse Section Routes
const WarehouseManagement = () => <PlaceholderPage name="Warehouse Management" />;
const Inventory = () => <PlaceholderPage name="Inventory" />;
const DeliveryScheduler = () => <PlaceholderPage name="Delivery Scheduler" />;
const GoodsReceipt = () => <PlaceholderPage name="Goods Receipt" />;
const StockMovement = () => <PlaceholderPage name="Stock Movement" />;

// MCP Section Routes
const MCPDashboard = () => <PlaceholderPage name="MCP Dashboard" />;
const DocumentSync = () => <DocumentBridgePage />;
const MorpheusInbox = () => <PlaceholderPage name="Morpheus Inbox" />;
const XeroSyncHealth = () => <PlaceholderPage name="Xero Sync Health" />;
const InfrastructureDashboard = () => <InfrastructureDashboardComponent />; // Use actual component

// Advanced Section Routes
const ReportsPage = () => <Reports />;
const ECommerce = () => <PlaceholderPage name="eCommerce" />;
const AIArea = () => <PlaceholderPage name="AI Area" />;
const Communications = () => <PlaceholderPage name="Communications" />;
const Vault = () => <PlaceholderPage name="Vault" />;
const PatchLog = () => <PlaceholderPage name="Patch Log" />;

export function Router() {
  // Skip authentication for testing - direct dashboard
  return (
    <Layout>
      <Switch>
        {/* Primary Navigation (Always Visible) */}
        <Route path="/" component={Dashboard} />
        <Route path="/pos" component={POS} />
        <Route path="/products" component={Products} />
        <Route path="/customers" component={Customers} />
        <Route path="/settings" component={Settings} />

        {/* Essential Section Routes */}
        <Route path="/orders" component={Orders} />

        {/* Business Section Routes */}
        <Route path="/suppliers" component={Suppliers} />
        <Route path="/purchase-orders" component={PurchaseOrders} />
        <Route path="/supplier-invoices" component={SupplierInvoices} />
        <Route path="/passports" component={Passports} />
        <Route path="/price-list-review" component={PriceListReview} />

        {/* Finance Section Routes */}
        <Route path="/daily-balance" component={DailyBalance} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/banking" component={Banking} />
        <Route path="/vat-returns" component={VATReturns} />
        <Route path="/accounts" component={Accounts} />

        {/* Warehouse Section Routes */}
        <Route path="/warehouse-management" component={WarehouseManagement} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/delivery-scheduler" component={DeliveryScheduler} />
        <Route path="/goods-receipt" component={GoodsReceipt} />
        <Route path="/stock-movement" component={StockMovement} />

        {/* MCP Section Routes */}
        <Route path="/mcp-dashboard" component={MCPDashboard} />
        <Route path="/document-sync" component={DocumentSync} />
        <Route path="/morpheus-inbox" component={MorpheusInbox} />
        <Route path="/xero-sync-health" component={XeroSyncHealth} />
        <Route path="/infrastructure-dashboard" component={InfrastructureDashboard} />

        {/* Advanced Section Routes */}
        <Route path="/reports" component={ReportsPage} />
        <Route path="/ecommerce" component={ECommerce} />
        <Route path="/ai-area" component={AIArea} />
        <Route path="/communications" component={Communications} />
        <Route path="/vault" component={Vault} />
        <Route path="/patch-log" component={PatchLog} />
        <Route path="/profile" component={Profile} />

        {/* 404 Fallback */}
        <Route>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold divine-gradient-text mb-4">Page Not Found</h2>
            <p className="text-slate-400">
              The requested page does not exist or has not been implemented yet.
            </p>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}
