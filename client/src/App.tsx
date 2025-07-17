import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { ErrorBoundary } from "@/components/error-boundary";
import { Suspense } from "react";
import {
  LazyHome,
  LazyLanding,
  LazyOrbitProduction,
  LazyNotFound,
} from "@/pages/LazyPages";

function Router() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>}>
      <Switch>
        <Route path="/" component={LazyLanding} />
        <Route path="/builder" component={LazyHome} />
        <Route path="/orbit" component={LazyOrbitProduction} />
        <Route component={LazyNotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <div className="dark">
              <Toaster />
              <Router />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
