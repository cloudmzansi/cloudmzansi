import React, { useState } from "react";
import { useLocation } from "wouter";
import { supabase, getCurrentUserWithRole } from "@/lib/supabaseClient";

const LoginPage = () => {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    // Get user role and redirect
    const user = await getCurrentUserWithRole();
    if (user?.role === "admin") {
      setLocation("/dashboard");
    } else {
      setLocation("/portal");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f7fa" }}>
      <form
        onSubmit={handleLogin}
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          minWidth: 320,
          maxWidth: 360,
          width: "100%"
        }}
      >
        <h2 style={{ marginBottom: 24, textAlign: "center", fontWeight: 700 }}>Sign In</h2>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
          />
        </div>
        {error && <div style={{ color: "#d32f2f", marginBottom: 12, textAlign: "center" }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            background: "#2d6cdf",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage; 