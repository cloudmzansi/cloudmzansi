import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/utils";

interface CommunicationTabProps {
  user: any;
}

const CommunicationTab: React.FC<CommunicationTabProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [messageInputs, setMessageInputs] = useState<{ [projectId: string]: string }>({});
  const [sending, setSending] = useState<{ [projectId: string]: boolean }>({});

  useEffect(() => {
    const fetchProjectsAndMessages = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }
      // Fetch client record for this user
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (clientError || !client) {
        setError("No client record found for this user.");
        setLoading(false);
        return;
      }
      // Fetch projects for this client
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, project_name')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });
      if (projectsError) {
        setError("Failed to fetch projects.");
        setLoading(false);
        return;
      }
      // For each project, fetch messages
      const projectsWithMessages = await Promise.all(
        (projectsData || []).map(async (project: any) => {
          const { data: messages, error: messagesError } = await supabase
            .from('project_messages')
            .select('id, sender, content, created_at')
            .eq('project_id', project.id)
            .order('created_at', { ascending: true });
          return {
            ...project,
            messages: messages || [],
          };
        })
      );
      setProjects(projectsWithMessages);
      setLoading(false);
    };
    fetchProjectsAndMessages();
  }, [user, sending]);

  const handleSendMessage = async (projectId: string) => {
    const content = messageInputs[projectId]?.trim();
    if (!content) return;
    setSending(s => ({ ...s, [projectId]: true }));
    // For demo: just simulate send
    setTimeout(() => {
      setSending(s => ({ ...s, [projectId]: false }));
      setMessageInputs(i => ({ ...i, [projectId]: "" }));
      alert(`Message sent to project ${projectId}`);
    }, 1000);
    // In production: insert into project_messages table
  };

  if (loading) return <div className="text-gray-500">Loading messages...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!projects.length) return <div className="text-gray-500">No projects found.</div>;

  return (
    <div className="space-y-8">
      {projects.map(project => (
        <div key={project.id} className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{project.project_name}</h3>
          <div className="mb-4 max-h-48 overflow-y-auto space-y-2">
            {project.messages.length === 0 ? (
              <div className="text-gray-500 text-sm">No messages yet.</div>
            ) : (
              project.messages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.sender === user.email ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-lg text-sm max-w-xs ${msg.sender === user.email ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <div>{msg.content}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-1 text-sm"
              placeholder="Type a message..."
              value={messageInputs[project.id] || ""}
              onChange={e => setMessageInputs(i => ({ ...i, [project.id]: e.target.value }))}
              disabled={sending[project.id]}
            />
            <button
              onClick={() => handleSendMessage(project.id)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm font-semibold"
              disabled={sending[project.id]}
            >
              {sending[project.id] ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunicationTab; 