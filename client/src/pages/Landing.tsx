import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold divine-gradient-text">MercuryOne</h1>
          <p className="text-xl text-slate-400">
            Enterprise-ready business management with divine-powered intelligence
          </p>
        </div>
        
        <div className="glass-card p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-white">Welcome to MercuryOne Divine</h2>
          <p className="text-slate-400">
            The comprehensive family business management system specifically designed for UK furniture retail operations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/">
              <Button className="primary-button w-full sm:w-auto">
                Enter Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-slate-500">
          MercuryOne v1068.0 Enterprise • Production Ready
        </div>
      </div>
    </div>
  );
}