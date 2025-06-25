
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Link from 'next/link';
import { supabase } from '../../../lib/supabase_client';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  
  const handleSignup = async (e: FormData) => {
    setPending(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row border border-green-600 bg-green-100 rounded-2xl max-w-[650px] w-full mx-auto shadow-lg">
        <form
          action={handleSignup}
          className="flex flex-col flex-1 border-r-0 md:border-r border-primary-500 rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl bg-white p-8"
        >
          <h1 className="text-2xl font-bold text-center text-primary-700 mb-2">Welcome to Diseased Maize detector Dashboard!</h1>
          <p className="text-gray-600 text-center mb-6">Sign-up to know about maize disease trends</p>
          
          {error && (
            <p aria-live="polite" className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg font-medium">
              {error}
            </p>
          )}

          <div className="flex flex-col  mb-4">
            <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              className="p-3 border rounded-lg border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col mb-6">
            <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="p-3 border rounded-lg border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
         
          <button
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-lg font-medium transition-colors disabled:bg-primary-400 disabled:cursor-not-allowed"
            disabled={pending}
          >
            {pending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : "Register"}
          </button>
        </form>
        
        <div className="flex flex-col items-center justify-center p-8 bg-primary-50 rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl">
          <p className="text-lg font-semibold text-gray-700 mb-4">Already have an account?</p>
          <Link
            href="/login"
            className="w-full text-center bg-white hover:bg-gray-100 text-primary-600 border border-primary-500 px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}