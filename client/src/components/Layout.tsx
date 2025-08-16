import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
  Truck,
  Receipt,
  Badge,
  BarChart3,
  DollarSign,
  CreditCard,
  Building2,
  Calculator,
  Warehouse,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Zap,
  RefreshCw,
  Inbox,
  Globe,
  Bot,
  MessageSquare,
  Shield,
  Bell,
  User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const [collapsibleSections, setCollapsibleSections] = useState({
    essential: true,
    business: false,
    finance: false,
    warehouse: false,
    mcp: false,
    advanced: false
  });

  const toggleSection = (section: keyof typeof collapsibleSections) => {
    setCollapsibleSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const mainNavigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'POS', href: '/pos', icon: ShoppingCart },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const essentialLinks = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Point of Sale', href: '/pos', icon: ShoppingCart },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: FileText },
    { name: 'Customers', href: '/customers', icon: Users },
  ];

  const businessLinks = [
    { name: 'Suppliers', href: '/suppliers', icon: Truck },
    { name: 'Purchase Orders', href: '/purchase-orders', icon: FileText },
    { name: 'Supplier Invoices', href: '/supplier-invoices', icon: Receipt },
    { name: 'Passports', href: '/passports', icon: Badge },
    { name: 'Price List Review', href: '/price-list-review', icon: BarChart3 },
  ];

  const financeLinks = [
    { name: 'Daily Balance', href: '/daily-balance', icon: DollarSign },
    { name: 'Expenses', href: '/expenses', icon: CreditCard },
    { name: 'Banking', href: '/banking', icon: Building2 },
    { name: 'VAT Returns', href: '/vat-returns', icon: FileText },
    { name: 'Accounts', href: '/accounts', icon: Calculator },
  ];

  const warehouseLinks = [
    { name: 'Warehouse Management', href: '/warehouse-management', icon: Warehouse },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Delivery Scheduler', href: '/delivery-scheduler', icon: Calendar },
    { name: 'Goods Receipt', href: '/goods-receipt', icon: ClipboardCheck },
    { name: 'Stock Movement', href: '/stock-movement', icon: TrendingUp },
  ];

  const mcpLinks = [
    { name: 'MCP Dashboard', href: '/mcp-dashboard', icon: Zap },
    { name: 'Document Sync', href: '/document-sync', icon: RefreshCw },
    { name: 'Morpheus Inbox', href: '/morpheus-inbox', icon: Inbox },
    { name: 'Xero Sync Health', href: '/xero-sync-health', icon: BarChart3 },
  ];

  const advancedLinks = [
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'eCommerce', href: '/ecommerce', icon: Globe },
    { name: 'AI Area', href: '/ai-area', icon: Bot },
    { name: 'Communications', href: '/communications', icon: MessageSquare },
    { name: 'Vault', href: '/vault', icon: Shield },
    { name: 'Patch Log', href: '/patch-log', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div
      className="flex h-screen text-white font-sans overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, var(--background), var(--card))',
      }}
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 sidebar`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 divine-gradient rounded-lg"></div>
              <span className="text-xl font-bold">MercuryOne</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            {/* Main navigation items */}
            <div className="space-y-2 px-3 mb-6">
              {mainNavigation.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <a className={`nav-link-main ${isActive ? 'active' : ''}`}>
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </a>
                  </Link>
                );
              })}
            </div>

            {/* Essential Section */}
            <div className="mb-4">
              <button 
                className="nav-section-header"
                onClick={() => toggleSection('essential')}
              >
                <ChevronDown className="w-4 h-4" />
                <span>Essential</span>
              </button>
              {collapsibleSections.essential && (
                <div className="space-y-1 pl-4 mt-2">
                  {essentialLinks.map((item) => {
                    const isActive = location === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} href={item.href}>
                        <a className={`nav-link ${isActive ? 'active' : ''}`}>
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Business Section */}
            <div className="mb-4">
              <button 
                className="nav-section-header"
                onClick={() => toggleSection('business')}
              >
                <ChevronDown className="w-4 h-4" />
                <span>Business</span>
              </button>
              {collapsibleSections.business && (
                <div className="space-y-1 pl-4 mt-2">
                  {businessLinks.map((item) => {
                    const isActive = location === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} href={item.href}>
                        <a className={`nav-link ${isActive ? 'active' : ''}`}>
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Finance Section */}
            <div className="mb-4">
              <button 
                className="nav-section-header"
                onClick={() => toggleSection('finance')}
              >
                <ChevronDown className="w-4 h-4" />
                <span>Finance</span>
              </button>
              {collapsibleSections.finance && (
                <div className="space-y-1 pl-4 mt-2">
                  {financeLinks.map((item) => {
                    const isActive = location === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} href={item.href}>
                        <a className={`nav-link ${isActive ? 'active' : ''}`}>
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Warehouse Section */}
            <div className="mb-4">
              <button 
                className="nav-section-header"
                onClick={() => toggleSection('warehouse')}
              >
                <ChevronDown className="w-4 h-4" />
                <span>Warehouse</span>
              </button>
              {collapsibleSections.warehouse && (
                <div className="space-y-1 pl-4 mt-2">
                  {warehouseLinks.map((item) => {
                    const isActive = location === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} href={item.href}>
                        <a className={`nav-link ${isActive ? 'active' : ''}`}>
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* MCP Section */}
            <div className="mb-4">
              <button 
                className="nav-section-header"
                onClick={() => toggleSection('mcp')}
              >
                <ChevronDown className="w-4 h-4" />
                <span>MCP</span>
              </button>
              {collapsibleSections.mcp && (
                <div className="space-y-1 pl-4 mt-2">
                  {mcpLinks.map((item) => {
                    const isActive = location === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} href={item.href}>
                        <a className={`nav-link ${isActive ? 'active' : ''}`}>
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Advanced Section */}
            <div className="mb-4">
              <button 
                className="nav-section-header"
                onClick={() => toggleSection('advanced')}
              >
                <ChevronDown className="w-4 h-4" />
                <span>Advanced</span>
              </button>
              {collapsibleSections.advanced && (
                <div className="space-y-1 pl-4 mt-2">
                  {advancedLinks.map((item) => {
                    const isActive = location === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} href={item.href}>
                        <a className={`nav-link ${isActive ? 'active' : ''}`}>
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="h-16 bg-card border-b divine-glass">
          <div className="flex items-center justify-between h-full px-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex-1"></div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-400">
                <Bell className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" size="sm" className="text-slate-400">
                <User className="h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground">
                MercuryOne Enterprise v1068.0
              </div>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-400">
                Production Ready
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}