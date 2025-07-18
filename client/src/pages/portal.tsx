import React from "react";
import { useLocation } from "wouter";
import { supabase, getCurrentUserWithRole } from "@/lib/supabaseClient";

const PortalPage = () => {
  const [, setLocation] = useLocation();
  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    getCurrentUserWithRole().then(setUser);
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/login");
  };
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <strong>User:</strong> {user?.email}
        </div>
        <button onClick={handleLogout} style={{ background: "#d32f2f", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }}>Logout</button>
      </div>
      <h1>Client Portal</h1>
      <section>
        <h2>Welcome</h2>
        <p>Welcome to your client portal. Here you can view your projects, invoices, and more.</p>
      </section>
      <section>
        <h2>Project Status</h2>
        <p>Track the status of your ongoing projects here.</p>
      </section>
      <section>
        <h2>Invoices</h2>
        <p>View and pay your invoices.</p>
      </section>
      <section>
        <h2>File Sharing</h2>
        <p>Upload and download project files.</p>
      </section>
      <section>
        <h2>Communication</h2>
        <p>Send messages to your project team.</p>
      </section>
      <section>
        <h2>Support</h2>
        <p>Open and track support tickets.</p>
      </section>
      <section>
        <h2>Profile</h2>
        <p>Manage your profile information.</p>
      </section>
      <section>
        <h2>Notification Preferences</h2>
        <p>Set your notification preferences.</p>
      </section>
    </div>
  );
};

export default PortalPage; 