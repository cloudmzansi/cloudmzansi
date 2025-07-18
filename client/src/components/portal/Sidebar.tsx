import React from "react";

type Section = { key: string; label: string };

interface SidebarProps {
  user: any;
  sections: Section[];
  active: string;
  setActive: (key: string) => void;
  onLogout: () => void;
}

const PortalSidebar: React.FC<SidebarProps> = ({ user, sections, active, setActive, onLogout }) => (
  <aside className="w-64 bg-white border-r flex flex-col">
    <div className="p-6 border-b flex flex-col gap-2">
      <div className="font-bold text-lg">Client Portal</div>
      <div className="text-sm text-gray-500">{user?.email}</div>
      <button onClick={onLogout} className="mt-2 bg-red-600 text-white rounded px-3 py-1 font-semibold hover:bg-red-700">Logout</button>
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
);

export default PortalSidebar; 