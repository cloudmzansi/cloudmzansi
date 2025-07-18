import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/utils";

interface NotificationPreferencesTabProps {
  user: any;
}

const NotificationPreferencesTab: React.FC<NotificationPreferencesTabProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }
      // For demo: just use a default
      setPrefs({ email: true });
      setLoading(false);
      // In production: fetch from notifications table or user_profiles
    };
    fetchPrefs();
  }, [user, saving]);

  const handleToggle = async () => {
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setPrefs((p: any) => ({ ...p, email: !p.email }));
      setSaving(false);
      setSuccess(true);
    }, 500);
    // In production: update notification preferences in DB
  };

  if (loading) return <div className="text-gray-500">Loading preferences...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="flex items-center gap-4 mb-2">
        <span className="text-sm">Email Notifications</span>
        <button
          onClick={handleToggle}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${prefs?.email ? 'bg-blue-600' : 'bg-gray-300'}`}
          disabled={saving}
        >
          <span
            className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-200 ${prefs?.email ? 'translate-x-6' : ''}`}
          />
        </button>
      </div>
      {saving && <div className="text-gray-500 text-sm">Saving...</div>}
      {success && <div className="text-green-600 text-sm">Preferences updated!</div>}
    </div>
  );
};

export default NotificationPreferencesTab; 