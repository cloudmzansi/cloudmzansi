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

function useUser() {
  const [user, setUser] = useState<any | null>(undefined);
  useEffect(() => {
    getCurrentUserWithRole().then(setUser);
  }, []);
  return user;
}

function AdminGuard({ children }: { children: (user: any) => JSX.Element }) {
  const user = useUser();
  if (user === undefined) return null;
  if (!user) return children(null); // Guest mode
  if (user.role !== 'admin') return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Unauthorized: Admins only</div>;
  return children(user);
}

function ClientGuard({ children }: { children: (user: any) => JSX.Element }) {
  const user = useUser();
  if (user === undefined) return null;
  if (!user) return children(null); // Guest mode
  if (user.role === 'admin') return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Unauthorized: Clients only</div>;
  return children(user);
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/login" component={LoginPage} />
      <Route path="/portal" component={() => (
        <ClientGuard>
          {(user) => <PortalPage user={user} guest={!user} />}
        </ClientGuard>
      )} />
      <Route path="/dashboard" component={() => (
        <AdminGuard>
          {(user) => <DashboardPage user={user} guest={!user} />}
        </AdminGuard>
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
