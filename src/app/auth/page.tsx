
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Leaf, Shield, TrendingUp, Users } from "lucide-react";
import { supabase } from "../../../lib/supabase_client";


export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setPending(false);
        return;
      }

      router.push("/dashboard");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        setError(error.message);
        setPending(false);
        return;
      }

      router.push("/dashboard");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(22,163,74,0.1),transparent_50%)]"></div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>

          <div className="z-10">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl mr-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold">Maize Disease Detector</h1>
            </div>

            <h2 className="text-4xl font-bold mb-6">Protect Your Maize Crops with AI</h2>
            <p className="text-xl mb-12 text-green-100">Detect and prevent maize diseases before they spread.</p>

            <div className="space-y-6">
              {[
                { icon: Shield, title: "Early Detection", desc: "Identify diseases before symptoms show" },
                { icon: TrendingUp, title: "Real-time Analytics", desc: "Track disease trends" },
                { icon: Users, title: "Community Insights", desc: "Share data with other farmers" },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-green-100">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back!" : "Get Started"}
              </h2>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to access maize health dashboard"
                  : "Join thousands of farmers protecting their crops"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={pending}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={pending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={pending}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50"
              >
                {pending ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-green-600 hover:text-green-700 font-semibold hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
