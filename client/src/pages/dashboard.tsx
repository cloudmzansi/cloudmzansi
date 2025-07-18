import React, { useState } from "react";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter Website",
    price: 1500,
    features: [
      "Up to 5 pages",
      "Responsive Design",
      "Contact Form",
      "Basic SEO",
    ],
  },
  {
    id: "business",
    name: "Business Website",
    price: 2500,
    features: [
      "Up to 10 pages",
      "Custom Design",
      "Blog/News Section",
      "Advanced SEO",
      "1 Year Support",
    ],
  },
  {
    id: "ecommerce",
    name: "eCommerce Website",
    price: 3500,
    features: [
      "Online Store Setup",
      "Payment Integration",
      "Product Management",
      "Secure Checkout",
      "Order Tracking",
    ],
  },
];

const MOCK_DEALS = [
  // Example: { email: 'andrewmichaelsrsa@gmail.com', packageId: 'business', assignedAt: new Date() }
];

const AdminDashboardPage = () => {
  const [email, setEmail] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deals, setDeals] = useState<any[]>(MOCK_DEALS);

  const handleAssign = async () => {
    setAssigning(true);
    setSuccess(false);
    setError(null);
    // For demo: just simulate API call
    setTimeout(() => {
      if (!email || !selectedPackage) {
        setError("Please enter an email and select a package.");
        setAssigning(false);
        return;
      }
      setDeals(ds => [
        ...ds,
        {
          email,
          packageId: selectedPackage,
          assignedAt: new Date(),
        },
      ]);
      setAssigning(false);
      setSuccess(true);
      setEmail("");
      setSelectedPackage(null);
    }, 1200);
    // In production: call backend to create project, contract, and associate with client
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard: Assign Website Deal</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Client Email</label>
          <input
            type="email"
            className="border rounded px-3 py-2 w-full text-sm"
            placeholder="Enter client email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={assigning}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Website Package</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedPackage === pkg.id ? 'border-blue-600 shadow-lg' : 'border-gray-200'}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-lg">{pkg.name}</div>
                  <div className="text-blue-600 font-bold text-lg">R{pkg.price}</div>
                </div>
                <ul className="text-sm text-gray-700 mb-2 list-disc pl-5">
                  {pkg.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Get Started</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Subscribe</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleAssign}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
          disabled={assigning}
        >
          {assigning ? 'Assigning...' : 'Assign Deal to Client'}
        </button>
        {success && <div className="text-green-600 mt-2">Deal assigned successfully!</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>
      <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
        <h2 className="text-xl font-bold mb-4">Assigned Deals</h2>
        {deals.length === 0 ? (
          <div className="text-gray-500">No deals assigned yet.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Client Email</th>
                <th className="px-4 py-2 text-left">Package</th>
                <th className="px-4 py-2 text-left">Assigned At</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal, i) => {
                const pkg = PACKAGES.find(p => p.id === deal.packageId);
                return (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="px-4 py-2 font-mono">{deal.email}</td>
                    <td className="px-4 py-2">{pkg?.name || deal.packageId}</td>
                    <td className="px-4 py-2">{new Date(deal.assignedAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage; 