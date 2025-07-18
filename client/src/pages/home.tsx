import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import About from "@/components/about";
import Services, { Pricing } from "@/components/services";
import Portfolio from "@/components/portfolio";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/utils';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const getUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Try to get role from user_metadata first
        const userRole = user.user_metadata?.role;
        if (userRole) {
          setRole(userRole);
        } else {
          // Fallback: fetch from user_profiles table
          const { data, error } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          if (data && data.role) setRole(data.role);
        }
      }
    };
    getUserAndRole();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUserAndRole();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Registration successful! Check your email for verification.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) {
      setResetMessage(error.message);
    } else {
      setResetMessage('Password reset email sent! Check your inbox.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <section id="hero" className="section-padding bg-white">
        <Hero />
      </section>
      <section id="about" className="section-padding bg-gray-50">
        <About />
      </section>
      <section id="services" className="section-padding bg-white">
        <Services />
      </section>
      <section id="pricing" className="section-padding bg-gray-50">
        <Pricing />
      </section>
      <section id="portfolio" className="section-padding bg-white">
        <Portfolio />
      </section>
      <section id="contact" className="section-padding bg-gray-50">
        <Contact />
      </section>
      <Footer />
      <div>
        {user && (
          <div>
            <p>Logged in as: {user.email}</p>
            <p>Role: {role || 'Unknown'}</p>
          </div>
        )}
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
        <p>After registering, please check your email for a verification link.</p>
        <div>
          <button type="button" onClick={() => handleSocialLogin('google')}>Sign in with Google</button>
          <button type="button" onClick={() => handleSocialLogin('github')}>Sign in with GitHub</button>
        </div>
      </div>
      <div>
        <h2>Forgot your password?</h2>
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
            required
          />
          <button type="submit">Send Password Reset Email</button>
        </form>
        {resetMessage && <p>{resetMessage}</p>}
      </div>
    </div>
  );
}
