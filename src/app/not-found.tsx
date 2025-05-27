"use client"

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Number with Animation */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-primary/20 select-none animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Oops! This page you were looking for cannot be found.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="min-w-32"
            onClick={() => window.history.back()}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
