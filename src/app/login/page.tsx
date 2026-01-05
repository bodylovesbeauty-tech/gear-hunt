"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Try to log in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/'); // Send them to homepage on success
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    // Create new user
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Account created! You are now logged in.');
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-yellow-500">GEAR HUNT</h2>
        <p className="text-gray-400 text-center mb-8">Login to your Garage</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none"
              placeholder="rider@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Log In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">New here?</p>
          <button
            onClick={handleSignUp}
            className="text-yellow-500 hover:underline text-sm font-bold mt-1"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}