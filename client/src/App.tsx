import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import PortalPage from "@/pages/portal";
import DashboardPage from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getCurrentUserWithRole, supabase } from "@/lib/supabaseClient";

function AuthGuard({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<any>(null);
  const [, setLocation] = useLocation();
  useEffect(() => {
    getCurrentUserWithRole().then(u => {
      if (!u) {
        setLocation("/login");
      } else {
        setUser(u);
      }
    });
  }, [setLocation]);
  if (!user) return null;
  return children;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/login" component={LoginPage} />
      <Route path="/portal" component={() => (
        <AuthGuard>
          <PortalPage />
        </AuthGuard>
      )} />
      <Route path="/dashboard" component={() => (
        <AuthGuard>
          <DashboardPage />
        </AuthGuard>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
