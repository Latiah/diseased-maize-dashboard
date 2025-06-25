'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Link from 'next/link';
import { supabase } from '../../../lib/supabase_client';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleLogin = async (e: FormData) => {
    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row border border-primary-500 bg-green rounded-2xl max-w-[650px] w-full mx-auto shadow-lg">
        <form
          action={handleLogin}
          className="flex flex-col flex-1 border-r border-primary-500 rounded-2xl bg-white p-6"
        >
          <p className="text-primary-400  text-center text-lg font-bold mb-3">Welcome back!</p>
          <p className="mb-3 text-center">Sign-in to know about maize disease trends</p>
          <p aria-live="polite" className="mb-3 text-red-600 font-semibold">
            {error}
          </p>
  
          <div className="flex flex-col mb-5">
            <label htmlFor="email" className="mb-1">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              className="p-2 border rounded-lg border-neutral-400 focus:border-primary-500 focus:ring-2 outline-none"
            />
          </div>
          <div className="flex flex-col mb-5">
            <div className="flex justify-between">
            <label htmlFor="password" className="mb-1">
              Password:
            </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="p-2 border rounded-lg border-neutral-400 focus:border-primary-500 focus:ring-2 outline-none font-serif"
            />
            
          </div>
         
          <button
            className="bg-primary-700 text-white px-5 py-2 rounded-lg mt-5 disabled:bg-primary-400 disabled:cursor-not-allowed"
            disabled={pending}
          >
            {pending ? "Loading..." : "Log in"}
          </button>
        </form>
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-lg font-semibold mb-5">Don't have an account?</p>
          <Link
            href="/signup"
            className="bg-primary-700 text-white px-4 py-1.5 rounded-lg"
          >
            Sign up
          </Link>
        </div>
      </div>
      </div>
  );
}
