import React from "react";
import { useLocation } from "wouter";
import { supabase, getCurrentUserWithRole } from "@/lib/supabaseClient";

const DashboardPage = () => {
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
          <strong>Admin:</strong> {user?.email}
        </div>
        <button onClick={handleLogout} style={{ background: "#d32f2f", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 600, cursor: "pointer" }}>Logout</button>
      </div>
      <h1>Admin Dashboard</h1>
      <section>
        <h2>User Management</h2>
        <p>View, edit, and manage users.</p>
      </section>
      <section>
        <h2>Project Oversight</h2>
        <p>Monitor and manage all projects.</p>
      </section>
      <section>
        <h2>Financial Management</h2>
        <p>View invoices, payments, and financial reports.</p>
      </section>
      <section>
        <h2>Analytics Dashboard</h2>
        <p>View analytics and performance metrics.</p>
      </section>
      <section>
        <h2>System Configuration</h2>
        <p>Manage system settings and configurations.</p>
      </section>
      <section>
        <h2>Content Management</h2>
        <p>Manage website and portal content.</p>
      </section>
      <section>
        <h2>Support Ticket Management</h2>
        <p>View and respond to support tickets.</p>
      </section>
      <section>
        <h2>Backup and Restore</h2>
        <p>Manage backups and restore data.</p>
      </section>
    </div>
  );
};

export default DashboardPage; 