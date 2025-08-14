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
  ChevronDown
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
            {/* Main navigation items */}
            <div className="space-y-2 px-3 mb-6">
              {mainNavigation.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={`w-full justify-start ${
                        isActive ? 'divine-gradient-subtle' : ''
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
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

            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                MercuryDivine Platform - Enterprise Edition
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