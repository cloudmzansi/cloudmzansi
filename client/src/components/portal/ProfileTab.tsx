import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/utils";

interface ProfileTabProps {
  user: any;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (profileError || clientError) {
        setError("Failed to fetch profile info.");
        setLoading(false);
        return;
      }
      setProfile(profileData);
      setClient(clientData);
      setLoading(false);
    };
    fetchProfile();
  }, [user, saving]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in (profile || {})) setProfile((p: any) => ({ ...p, [name]: value }));
    if (name in (client || {})) setClient((c: any) => ({ ...c, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    // For demo: just simulate save
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 1000);
    // In production: update user_profiles and clients tables
  };

  if (loading) return <div className="text-gray-500">Loading profile...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h3>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="company_name"
          className="border rounded px-3 py-1 text-sm"
          placeholder="Company Name"
          value={client?.company_name || ""}
          onChange={handleChange}
          disabled={saving}
        />
        <input
          type="text"
          name="phone"
          className="border rounded px-3 py-1 text-sm"
          placeholder="Phone"
          value={profile?.phone || ""}
          onChange={handleChange}
          disabled={saving}
        />
        <input
          type="text"
          name="address"
          className="border rounded px-3 py-1 text-sm"
          placeholder="Address"
          value={profile?.address || ""}
          onChange={handleChange}
          disabled={saving}
        />
        <textarea
          name="project_requirements"
          className="border rounded px-3 py-1 text-sm"
          placeholder="Project Requirements"
          value={client?.project_requirements || ""}
          onChange={handleChange}
          disabled={saving}
          rows={3}
        />
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm font-semibold"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {success && <div className="text-green-600 mt-2 text-sm">Profile updated!</div>}
    </div>
  );
};

export default ProfileTab; 