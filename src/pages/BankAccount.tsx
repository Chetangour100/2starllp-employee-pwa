import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Landmark,
  Loader2,
  Pencil,
  BadgeCheck,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";

export default function BankAccount() {
  const navigate = useNavigate();
  const { employee, refreshProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [bankName, setBankName] = useState(
    employee?.bankName || "",
  );
  const [bankAccount, setBankAccount] = useState(
    employee?.bankAccount || "",
  );
  const [ifscCode, setIfscCode] = useState(
    employee?.ifscCode || "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing && employee) {
      setBankName(employee.bankName || "");
      setBankAccount(employee.bankAccount || "");
      setIfscCode(employee.ifscCode || "");
    }
  }, [employee, editing]);

  const startEdit = () => {
    setBankName(employee?.bankName || "");
    setBankAccount(employee?.bankAccount || "");
    setIfscCode(employee?.ifscCode || "");
    setError("");
    setEditing(true);
  };

  const handleSave = async () => {
    const empId = employee?.employeeId || (employee as any)?.id;
    if (!empId) {
      setError("Employee ID not found. Please log in again.");
      return;
    }
    setError("");

    if (!bankName.trim()) {
      setError("Please enter your bank name.");
      return;
    }
    if (!/^\d{9,18}$/.test(bankAccount)) {
      setError("Account number should be 9 to 18 digits.");
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setError("Please enter a valid IFSC code.");
      return;
    }

    try {
      setSaving(true);
      await apiClient.put(
        API_CONFIG.ENDPOINTS.EMPLOYEE.UPDATE(empId),
        {
          bankName: bankName.trim(),
          bankAccount,
          ifscCode,
        },
      );
      await refreshProfile();
      setEditing(false);
    } catch (err: any) {
      setError(err?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell pb-10">
      <div className="px-5 pt-6">
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-bold leading-tight text-gray-900">
              Bank Account
            </h1>
            <p className="text-xs text-gray-400">
              Your salary account
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}

        {editing ? (
          <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                Bank Name
              </label>
              <input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                Account Number
              </label>
              <input
                inputMode="numeric"
                value={bankAccount}
                onChange={(e) =>
                  setBankAccount(
                    e.target.value.replace(/\D/g, ""),
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                IFSC Code
              </label>
              <input
                value={ifscCode}
                maxLength={11}
                onChange={(e) =>
                  setIfscCode(e.target.value.toUpperCase())
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-brand"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-gradient-to-br from-brand-light to-brand-dark p-5 text-white shadow-lg shadow-brand/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Landmark className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {employee?.bankName || "Bank not added"}
                  </p>
                  <p className="text-[11px] text-white/70">
                    Primary Salary Account
                  </p>
                </div>
              </div>
              {employee?.bankAccount && (
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>

            <div className="mt-5 space-y-1 text-xs">
              <p>
                Account Number:{" "}
                <span className="font-semibold">
                  {employee?.bankAccount || "-"}
                </span>
              </p>
              <p>
                IFSC Code:{" "}
                <span className="font-semibold">
                  {employee?.ifscCode || "-"}
                </span>
              </p>
            </div>

            <button
              onClick={startEdit}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-xs font-semibold text-brand-dark"
            >
              <Pencil className="h-3 w-3" />
              Edit Bank Detail
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
