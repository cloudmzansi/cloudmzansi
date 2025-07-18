import React, { useState } from "react";
import { useLocation } from "wouter";
import { supabase, getCurrentUserWithRole } from "@/lib/supabaseClient";

const sections = [
  { key: "user-management", label: "User Management" },
  { key: "project-oversight", label: "Project Oversight" },
  { key: "financial-management", label: "Financial Management" },
  { key: "analytics", label: "Analytics Dashboard" },
  { key: "system-config", label: "System Configuration" },
  { key: "content-management", label: "Content Management" },
  { key: "support-tickets", label: "Support Ticket Management" },
  { key: "backup-restore", label: "Backup and Restore" },
];

const DashboardPage = () => {
  const [, setLocation] = useLocation();
  const [user, setUser] = React.useState<any>(null);
  const [active, setActive] = useState("user-management");
  React.useEffect(() => {
    getCurrentUserWithRole().then(setUser);
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/login");
  };
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b flex flex-col gap-2">
          <div className="font-bold text-lg">Admin Dashboard</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
          <button onClick={handleLogout} className="mt-2 bg-red-600 text-white rounded px-3 py-1 font-semibold hover:bg-red-700">Logout</button>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {sections.map(s => (
            <button
              key={s.key}
              className={`text-left px-3 py-2 rounded hover:bg-blue-100 ${active === s.key ? "bg-blue-600 text-white" : "text-gray-700"}`}
              onClick={() => setActive(s.key)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {active === "user-management" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p>View, edit, and manage users.</p>
          </section>
        )}
        {active === "project-oversight" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Project Oversight</h2>
            <p>Monitor and manage all projects.</p>
          </section>
        )}
        {active === "financial-management" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Financial Management</h2>
            <p>View invoices, payments, and financial reports.</p>
          </section>
        )}
        {active === "analytics" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
            <p>View analytics and performance metrics.</p>
          </section>
        )}
        {active === "system-config" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">System Configuration</h2>
            <p>Manage system settings and configurations.</p>
          </section>
        )}
        {active === "content-management" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Content Management</h2>
            <p>Manage website and portal content.</p>
          </section>
        )}
        {active === "support-tickets" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Support Ticket Management</h2>
            <p>View and respond to support tickets.</p>
          </section>
        )}
        {active === "backup-restore" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Backup and Restore</h2>
            <p>Manage backups and restore data.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardPage; 