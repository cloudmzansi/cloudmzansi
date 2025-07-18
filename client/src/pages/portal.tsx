import React, { useState } from "react";
import { useLocation } from "wouter";
import { supabase, getCurrentUserWithRole } from "@/lib/supabaseClient";

const sections = [
  { key: "welcome", label: "Welcome" },
  { key: "project-status", label: "Project Status" },
  { key: "invoices", label: "Invoices" },
  { key: "file-sharing", label: "File Sharing" },
  { key: "communication", label: "Communication" },
  { key: "support", label: "Support" },
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notification Preferences" },
];

const PortalPage = () => {
  const [, setLocation] = useLocation();
  const [user, setUser] = React.useState<any>(null);
  const [active, setActive] = useState("welcome");
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
          <div className="font-bold text-lg">Client Portal</div>
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
        {active === "welcome" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Welcome</h2>
            <p>Welcome to your client portal. Here you can view your projects, invoices, and more.</p>
          </section>
        )}
        {active === "project-status" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Project Status</h2>
            <p>Track the status of your ongoing projects here.</p>
          </section>
        )}
        {active === "invoices" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Invoices</h2>
            <p>View and pay your invoices.</p>
          </section>
        )}
        {active === "file-sharing" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">File Sharing</h2>
            <p>Upload and download project files.</p>
          </section>
        )}
        {active === "communication" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Communication</h2>
            <p>Send messages to your project team.</p>
          </section>
        )}
        {active === "support" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Support</h2>
            <p>Open and track support tickets.</p>
          </section>
        )}
        {active === "profile" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p>Manage your profile information.</p>
          </section>
        )}
        {active === "notifications" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
            <p>Set your notification preferences.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default PortalPage; 