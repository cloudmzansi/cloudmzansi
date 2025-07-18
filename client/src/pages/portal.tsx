import React, { useState } from "react";
import { useLocation } from "wouter";
import { supabase, getCurrentUserWithRole } from "@/lib/supabaseClient";
import PortalSidebar from "@/components/portal/Sidebar";
import ProjectStatusTab from "@/components/portal/ProjectStatusTab";
import InvoicesTab from "@/components/portal/InvoicesTab";
import FileSharingTab from "@/components/portal/FileSharingTab";
import CommunicationTab from "@/components/portal/CommunicationTab";
import SupportTab from "@/components/portal/SupportTab";
import ProfileTab from "@/components/portal/ProfileTab";
import NotificationPreferencesTab from "@/components/portal/NotificationPreferencesTab";
import ContractsTab from "@/components/portal/ContractsTab";

const sections = [
  { key: "project-status", label: "Project Status" },
  { key: "invoices", label: "Invoices" },
  { key: "file-sharing", label: "File Sharing" },
  { key: "communication", label: "Communication" },
  { key: "support", label: "Support" },
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notification Preferences" },
  { key: "contracts", label: "Contracts" },
];

const PortalPage = () => {
  const [, setLocation] = useLocation();
  const [user, setUser] = React.useState<any>(null);
  const [active, setActive] = useState("project-status");
  React.useEffect(() => {
    getCurrentUserWithRole().then(setUser);
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/login");
  };
  return (
    <div className="min-h-screen flex bg-gray-50">
      <PortalSidebar
        user={user}
        sections={sections}
        active={active}
        setActive={setActive}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8">
        {active === "project-status" && <ProjectStatusTab user={user} />}
        {active === "invoices" && <InvoicesTab user={user} />}
        {active === "file-sharing" && <FileSharingTab user={user} />}
        {active === "communication" && <CommunicationTab user={user} />}
        {active === "support" && <SupportTab user={user} />}
        {active === "profile" && <ProfileTab user={user} />}
        {active === "notifications" && <NotificationPreferencesTab user={user} />}
        {active === "contracts" && <ContractsTab user={user} />}
      </main>
    </div>
  );
};

export default PortalPage; 