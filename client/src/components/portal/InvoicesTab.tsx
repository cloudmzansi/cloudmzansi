import React from "react";
import { supabase } from "@/lib/utils";

interface InvoicesTabProps {
  user: any;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({ user }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [invoices, setInvoices] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchInvoices = async () => {
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
      // Fetch invoices for this client
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('id, invoice_number, amount, status, due_date, paid_at, description')
        .eq('client_id', client.id)
        .order('due_date', { ascending: false });
      if (invoicesError) {
        setError("Failed to fetch invoices.");
        setLoading(false);
        return;
      }
      setInvoices(invoicesData || []);
      setLoading(false);
    };
    fetchInvoices();
  }, [user]);

  const handlePay = (invoice: any) => {
    // TODO: Integrate PayFast payment initiation here
    alert(`Initiate payment for invoice ${invoice.invoice_number}`);
  };

  if (loading) return <div className="text-gray-500">Loading invoices...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!invoices.length) return <div className="text-gray-500">No invoices found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm">
            <th className="px-4 py-2 text-left">Invoice #</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Due Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id} className="border-b last:border-b-0">
              <td className="px-4 py-2 font-mono">{inv.invoice_number}</td>
              <td className="px-4 py-2">{inv.description || '-'}</td>
              <td className="px-4 py-2 font-semibold">R {Number(inv.amount).toFixed(2)}</td>
              <td className="px-4 py-2">{inv.due_date || '-'}</td>
              <td className="px-4 py-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{inv.status}</span>
              </td>
              <td className="px-4 py-2">
                {inv.status !== 'paid' && (
                  <button
                    onClick={() => handlePay(inv)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm font-semibold"
                  >
                    Pay
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesTab; 