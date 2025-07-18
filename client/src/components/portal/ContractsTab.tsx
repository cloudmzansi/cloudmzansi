import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/utils";

interface ContractsTabProps {
  user: any;
}

const ContractsTab: React.FC<ContractsTabProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [signing, setSigning] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }
      // Fetch contracts for this user
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select('id, project_id, contract_type, terms, status, signed_at, signed_by, created_at')
        .eq('signed_by', user.id)
        .order('created_at', { ascending: false });
      if (contractsError) {
        setError("Failed to fetch contracts.");
        setLoading(false);
        return;
      }
      setContracts(contractsData || []);
      setLoading(false);
    };
    fetchContracts();
  }, [user, signing]);

  const handleSign = async (contractId: string) => {
    setSigning(contractId);
    // For demo: just simulate signing
    setTimeout(() => {
      setSigning(null);
      alert("Contract signed!");
    }, 1000);
    // In production: call /api/contract/sign or update contracts table
  };

  if (loading) return <div className="text-gray-500">Loading contracts...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!contracts.length) return <div className="text-gray-500">No contracts found.</div>;

  return (
    <div className="space-y-8">
      {contracts.map(contract => (
        <div key={contract.id} className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">{contract.contract_type}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${contract.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{contract.status}</span>
          </div>
          <div className="mb-2 text-sm text-gray-700 whitespace-pre-line">{contract.terms}</div>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <span>Created: {new Date(contract.created_at).toLocaleDateString()}</span>
            {contract.signed_at && <span>Signed: {new Date(contract.signed_at).toLocaleDateString()}</span>}
          </div>
          {contract.status !== 'signed' && (
            <button
              onClick={() => handleSign(contract.id)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm font-semibold"
              disabled={signing === contract.id}
            >
              {signing === contract.id ? 'Signing...' : 'Sign Contract'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContractsTab; 