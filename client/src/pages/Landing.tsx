import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md divine-glass">
        <CardHeader className="text-center">
          <div className="w-16 h-16 divine-gradient rounded-full mx-auto mb-4"></div>
          <CardTitle className="text-2xl">Welcome to MercuryDivine</CardTitle>
          <CardDescription>
            Enterprise document processing platform for UK furniture retail operations
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild className="w-full divine-gradient">
            <a href="/api/login">Sign In</a>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Powered by 13 MCP agents</p>
        </CardContent>
      </Card>
    </div>
  );
}
