"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type UserRole = "hospital" | "donor" | "bank";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("hospital");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText("");
    setMessage("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role,
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          setMessage("Signup successful! Redirecting to dashboard...");
          setTimeout(() => {
            router.push(`/${role}`);
          }, 800);
        } else {
          // If session wasn't created automatically, sign in immediately with credentials
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) {
            setMessage("Signup successful! Please sign in with your password.");
            setIsSignUp(false);
          } else {
            setMessage("Signup successful! Redirecting to dashboard...");
            setTimeout(() => {
              router.push(`/${role}`);
            }, 800);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const userRole = data.user?.user_metadata?.role || "hospital";
        setMessage("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          router.push(`/${userRole}`);
        }, 1000);
      }
    } catch (err: any) {
      setErrorText(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorText("");
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/${role}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorText(err.message || "Google sign-in failed.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-clay text-ink relative overflow-hidden page-enter">
      {/* Left Visual Editorial Section */}
      <section className="flex-1 bg-ink text-clay p-8 md:p-16 flex flex-col justify-between relative overflow-hidden min-h-[350px] md:min-h-screen">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <svg className="w-[600px] h-[600px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="#A8201A" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="30" stroke="#A8201A" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="20" stroke="#A8201A" strokeWidth="0.5" strokeDasharray="4 2" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-widest text-blood">
          <span className="h-2 w-2 rounded-full bg-blood animate-pulse" />
          LifeLine Bio-Secure Portal
        </div>

        <div className="relative z-10 max-w-lg mt-12 md:mt-0">
          <h2 className="font-display text-4xl sm:text-5xl font-medium leading-[1.1] tracking-tight">
            Every <span className="italic font-normal text-blood">second</span> counts in the supply chain.
          </h2>
          <p className="mt-6 text-sm md:text-base text-clay/60 leading-relaxed">
            Authorized portal access for verified hospital desks, voluntary donor emergency dispatches, and regional partner blood bank inventories.
          </p>
        </div>

        <div className="relative z-10 mt-12 md:mt-0 pt-6 border-t border-clay/10 flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-clay/40">
          <span>SECURE JWT AUTH</span>
          <span>SYSTEM ONLINE 100%</span>
        </div>
      </section>

      {/* Right Login Form Section */}
      <section className="w-full md:w-[480px] p-8 md:p-16 flex flex-col justify-center bg-clay">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold text-ink">
              {isSignUp ? "Create Account" : "Sign In"}
            </h1>
            <p className="mt-2 text-xs text-ink-60 font-body">
              {isSignUp
                ? "Select your target role and register your credentials."
                : "Select your role to access the Lifeline matching dashboard."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 bg-ink-5 rounded-xl mb-6">
            {(["hospital", "donor", "bank"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 rounded-lg font-mono text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  role === r
                    ? "bg-white text-ink shadow-sm border border-ink-10"
                    : "text-ink-40 hover:text-ink"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {message && (
            <div className="mb-4 p-3.5 rounded-xl border border-green-200 bg-green-50 font-mono text-xs text-green-700">
              {message}
            </div>
          )}

          {errorText && (
            <div className="mb-4 p-3.5 rounded-xl border border-blood bg-blood/5 font-mono text-xs text-blood">
              {errorText}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-40">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@hospital.org"
                className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-3 text-sm text-ink transition placeholder:text-ink-40"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-40">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-ink-10 bg-white px-4 py-3 text-sm text-ink transition placeholder:text-ink-40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-blood py-3 font-display text-sm font-semibold text-white transition hover:bg-blood-light disabled:opacity-50"
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-ink-10" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-40">or</span>
            <div className="flex-1 h-px bg-ink-10" />
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="mt-5 w-full flex items-center justify-center gap-3 rounded-xl border border-ink-10 bg-white py-3 font-display text-sm font-medium text-ink transition hover:bg-ink-5 hover:border-ink-20"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center space-y-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorText("");
                setMessage("");
              }}
              className="font-mono text-[10px] uppercase tracking-wider text-blood hover:underline font-semibold"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>

            <div>
              <Link
                href="/"
                className="inline-block font-mono text-[10px] uppercase tracking-wider text-ink-40 hover:text-ink"
              >
                ← Back to Main Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
