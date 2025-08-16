import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Home, Users, Package, ShoppingCart, FileText, Settings, Menu, X,
  Activity, Upload, Inbox, BarChart, Shield, Calendar, Truck,
  CreditCard, Receipt, Building, ChevronDown, ChevronRight,
  DollarSign, BookOpen, Archive, TrendingUp, Globe, Zap,
  MessageSquare, Lock, Bell, User, Server, BarChart3,
  Building2, Calculator, Warehouse, ClipboardCheck, RefreshCw,
  Badge, Bot
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigationSections = [
  {
    title: 'Essential',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Point of Sale', href: '/pos', icon: ShoppingCart },
      { name: 'Products', href: '/products', icon: Package },
      { name: 'Orders', href: '/orders', icon: FileText },
      { name: 'Customers', href: '/customers', icon: Users },
    ]
  },
  {
    title: 'Business',
    items: [
      { name: 'Suppliers', href: '/suppliers', icon: Users },
      { name: 'Purchase Orders', href: '/purchase-orders', icon: Building },
      { name: 'Supplier Invoices', href: '/supplier-invoices', icon: FileText },
      { name: 'Passports', href: '/passports', icon: Shield },
      { name: 'Price List Review', href: '/price-list-review', icon: BarChart },
    ]
  },
  {
    title: 'Finance',
    items: [
      { name: 'Daily Balance', href: '/daily-balance', icon: DollarSign },
      { name: 'Expenses', href: '/expenses', icon: Receipt },
      { name: 'Banking', href: '/banking', icon: Building },
      { name: 'VAT Returns', href: '/vat-returns', icon: FileText },
      { name: 'Accounts', href: '/accounts', icon: BookOpen },
    ]
  },
  {
    title: 'Warehouse',
    items: [
      { name: 'Warehouse Management', href: '/warehouse', icon: Package },
      { name: 'Inventory', href: '/inventory', icon: Archive },
      { name: 'Delivery Scheduler', href: '/delivery-scheduler', icon: Calendar },
      { name: 'Goods Receipt', href: '/goods-receipt', icon: Truck },
      { name: 'Stock Movement', href: '/stock-movement', icon: TrendingUp },
    ]
  },
  {
    title: 'MCP',
    items: [
      { name: 'MCP Dashboard', href: '/mcp-dashboard', icon: Activity },
      { name: 'Document Sync', href: '/document-sync', icon: Upload },
      { name: 'Morpheus Inbox', href: '/morpheus-inbox', icon: Inbox },
      { name: 'Xero Sync Health', href: '/xero-sync-health', icon: BarChart },
      { name: 'Infrastructure', href: '/infrastructure-dashboard', icon: Server },
    ]
  },
  {
    title: 'Advanced',
    items: [
      { name: 'Reports', href: '/reports', icon: BarChart },
      { name: 'eCommerce', href: '/ecommerce', icon: Globe },
      { name: 'AI Area', href: '/ai-area', icon: Zap },
      { name: 'Communications', href: '/communications', icon: MessageSquare },
      { name: 'Vault', href: '/vault', icon: Lock },
      { name: 'Patch Log', href: '/patch-log', icon: Activity },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Essential: true,
    Business: true,
    Finance: true,
    Warehouse: true,
    MCP: false,
    Advanced: false,
  });
  const [location] = useLocation();

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };



  return (
    <div className="flex h-screen bg-background">
      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 divine-gradient rounded-lg"></div>
            <span className="text-xl font-bold">MercuryDivine</span>
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
          <nav className="space-y-2">
            {navigationSections.map((section) => (
              <Collapsible
                key={section.title}
                open={openSections[section.title]}
                onOpenChange={() => toggleSection(section.title)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <span className="font-medium">{section.title}</span>
                    {openSections[section.title] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={`w-full justify-start ml-4 ${
                            isActive ? 'divine-gradient-subtle' : ''
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.name}
                        </Button>
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </nav>
        </ScrollArea>
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