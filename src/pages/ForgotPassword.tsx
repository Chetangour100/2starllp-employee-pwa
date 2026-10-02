import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";

type Step = "phone" | "otp" | "newPassword" | "success";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(
    null,
  );

  const handleSendOtp = async () => {
    setError("");
    if (!phone.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post<{
        email: string;
        devOtp?: string;
      }>(API_CONFIG.ENDPOINTS.EMPLOYEE_AUTH.FORGOT_PASSWORD, {
        phone: phone.trim(),
      });

      if (!response.success) {
        throw new Error(
          response.message || "Failed to send OTP",
        );
      }

      setMaskedEmail(response.data?.email || "");
      if (response.data?.devOtp) {
        setDevOtp(response.data.devOtp);
      }
      setStep("otp");
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not send OTP. Please check your mobile number.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.EMPLOYEE_AUTH.VERIFY_OTP,
        { phone: phone.trim(), otp: otp.trim() },
      );

      if (!response.success) {
        throw new Error(response.message || "Invalid OTP");
      }

      setStep("newPassword");
    } catch (err: any) {
      setError(err?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.EMPLOYEE_AUTH.RESET_PASSWORD,
        {
          phone: phone.trim(),
          otp: otp.trim(),
          newPassword,
          confirmPassword,
        },
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to reset password",
        );
      }

      setStep("success");
    } catch (err: any) {
      setError(
        err?.message || "Failed to reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col px-6 py-8">
      {step !== "success" && (
        <button
          onClick={() => navigate("/login")}
          className="mb-6 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}

      {step === "phone" && (
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            Forgot Password
          </h1>
          <p className="mt-1.5 mb-6 text-sm text-gray-500">
            Enter your registered mobile number — we'll send
            a 6-digit OTP to your registered email.
          </p>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

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

          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-light to-brand-dark py-3.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === "otp" && (
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            Verify OTP
          </h1>
          <p className="mt-1.5 mb-4 text-sm text-gray-500">
            Enter the 6-digit OTP sent to{" "}
            {maskedEmail || "your registered email"}. Valid
            for 10 minutes.
          </p>


          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <input
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter 6-digit OTP"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />

          <button
            onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-light to-brand-dark py-3.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      {step === "newPassword" && (
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            Set New Password
          </h1>
          <p className="mt-1.5 mb-6 text-sm text-gray-500">
            Choose a new password for your account.
          </p>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((p) => !p)
                  }
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
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-light to-brand-dark py-3.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}

      {step === "success" && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">
            Password Reset Successful
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-brand-light to-brand-dark py-3.5 text-sm font-semibold text-white"
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}
