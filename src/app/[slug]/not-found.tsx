import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <h2 className="text-xl font-semibold text-muted-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">
              <Search className="h-4 w-4 mr-2" />
              Create Your Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}