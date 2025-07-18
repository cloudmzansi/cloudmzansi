import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/utils";

interface SupportTabProps {
  user: any;
}

const SupportTab: React.FC<SupportTabProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [newTicket, setNewTicket] = useState({ subject: "", message: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }
      // Fetch tickets for this user
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('id, subject, message, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (ticketsError) {
        setError("Failed to fetch support tickets.");
        setLoading(false);
        return;
      }
      setTickets(ticketsData || []);
      setLoading(false);
    };
    fetchTickets();
  }, [user, creating]);

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;
    setCreating(true);
    // For demo: just simulate creation
    setTimeout(() => {
      setCreating(false);
      setNewTicket({ subject: "", message: "" });
      alert("Support ticket created!");
    }, 1000);
    // In production: insert into support_tickets table
  };

  if (loading) return <div className="text-gray-500">Loading support tickets...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Create New Ticket</h3>
        <div className="flex flex-col gap-2 mb-2">
          <input
            type="text"
            className="border rounded px-3 py-1 text-sm"
            placeholder="Subject"
            value={newTicket.subject}
            onChange={e => setNewTicket(t => ({ ...t, subject: e.target.value }))}
            disabled={creating}
          />
          <textarea
            className="border rounded px-3 py-1 text-sm"
            placeholder="Describe your issue..."
            value={newTicket.message}
            onChange={e => setNewTicket(t => ({ ...t, message: e.target.value }))}
            disabled={creating}
            rows={3}
          />
        </div>
        <button
          onClick={handleCreateTicket}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm font-semibold"
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Submit Ticket'}
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Your Support Tickets</h3>
        {tickets.length === 0 ? (
          <div className="text-gray-500 text-sm">No support tickets found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {tickets.map(ticket => (
              <li key={ticket.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{ticket.subject}</div>
                    <div className="text-sm text-gray-500">{ticket.message}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-700' : ticket.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{ticket.status}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{new Date(ticket.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SupportTab; 