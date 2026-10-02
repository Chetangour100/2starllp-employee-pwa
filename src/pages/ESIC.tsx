import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";
import { BottomNav } from "@/components/BottomNav";

export default function ESIC() {
  const navigate = useNavigate();
  const { employee, refreshProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [esicNumber, setEsicNumber] = useState(
    employee?.esicNumber || "",
  );
  const [maritalStatus, setMaritalStatus] = useState(
    employee?.maritalStatus || "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isActive = employee?.status !== "Inactive";

  useEffect(() => {
    if (!editing && employee) {
      setEsicNumber(employee.esicNumber || "");
      setMaritalStatus(employee.maritalStatus || "");
    }
  }, [employee, editing]);

  const startEdit = () => {
    setEsicNumber(employee?.esicNumber || "");
    setMaritalStatus(employee?.maritalStatus || "");
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

    if (esicNumber && !/^\d{10,17}$/.test(esicNumber)) {
      setError("ESIC number should be 10 to 17 digits.");
      return;
    }

    try {
      setSaving(true);
      await apiClient.put(
        API_CONFIG.ENDPOINTS.EMPLOYEE.UPDATE(empId),
        { esicNumber, maritalStatus },
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
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-bold text-gray-900">
            Employee State Insurance
          </h1>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <p className="text-sm font-semibold text-gray-900">
              Account Status
            </p>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                isActive
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          {editing ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  ESIC No.
                </label>
                <input
                  inputMode="numeric"
                  maxLength={17}
                  value={esicNumber}
                  onChange={(e) =>
                    setEsicNumber(
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Marital Status
                </label>
                <select
                  value={maritalStatus}
                  onChange={(e) =>
                    setMaritalStatus(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
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
            <>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">
                    ESIC No.
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {employee?.esicNumber || "Not added"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">
                    Marital Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {employee?.maritalStatus || "Not added"}
                  </p>
                </div>
              </div>

              <button
                onClick={startEdit}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-light to-brand-dark py-3 text-sm font-semibold text-white"
              >
                <Pencil className="h-4 w-4" />
                Edit ESIC Details
              </button>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
