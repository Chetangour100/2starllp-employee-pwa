import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { employee, loading, login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && employee) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();
    setError("");

    if (!phone.trim() || !password) {
      setError("Please enter your mobile number and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(phone.trim(), password);
      navigate("/");
    } catch (err: any) {
      setError(
        err?.message ||
          "Invalid mobile number or password.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col justify-center px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex items-center justify-center">
          <img
            src="/logo.svg"
            alt="2Star Staffing Logo"
            className="h-16 w-auto max-w-[200px] object-contain drop-shadow-sm"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith(".png")) {
                target.src = "/logo.png";
              }
            }}
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          2Star Staffing
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Employee Login
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter your mobile number"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            First time? Your password is your mobile number.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-light to-brand-dark py-3.5 text-sm font-semibold text-white shadow-md shadow-brand/20 disabled:opacity-60"
        >
          {submitting && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="w-full text-center text-sm font-medium text-brand"
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
}
