import React, { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Wait for session, then fetch role and redirect
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Fetch role from user_profiles
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role === "admin") {
        setLocation("/dashboard");
      } else {
        setLocation("/portal");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="text-3xl font-bold text-green-700 mb-2">Cloud<span className="text-black">Mzansi</span></div>
          <div className="text-lg text-gray-600 font-medium mb-2">Sign in to your account</div>
          <div className="text-sm text-gray-400">Access your client portal or admin dashboard</div>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            className="border border-gray-200 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-green-200"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            disabled={loading}
          />
          <input
            type="password"
            className="border border-gray-200 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-green-200"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold rounded px-4 py-2 transition-all"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
        </form>
        <div className="mt-8 text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Cloud Mzansi. All rights reserved.
        </div>
      </div>
    </div>
  );
} 