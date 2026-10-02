import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Landmark,
  ShieldCheck,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/formatters";

export default function Profile() {
  const navigate = useNavigate();
  const { employee, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  const empId = employee?.employeeId || (employee as any)?.id || "";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const copyId = () => {
    if (!empId) return;
    navigator.clipboard
      .writeText(empId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };

  return (
    <div className="app-shell pb-10">
      <div className="px-5 pt-6">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-bold text-gray-900">
            Profile
          </h1>
        </div>

        {/* PROFILE CARD */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-light to-brand-dark p-6 text-center text-white shadow-lg shadow-brand/20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
            {getInitials(employee?.name)}
          </div>
          <p className="mt-3 text-base font-semibold">
            {employee?.name}
          </p>
          <p className="text-sm text-white/80">
            {employee?.designation}
          </p>
          <button
            onClick={copyId}
            className="mx-auto mt-3 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs"
          >
            ID: {empId || "-"}
            <Copy className="h-3 w-3" />
            {copied && <span className="ml-1">Copied</span>}
          </button>
        </div>

        {/* PERSONAL */}
        <Section title="Personal">
          <Field label="Name" value={employee?.name} />
          <Field
            label="Email"
            value={employee?.email}
          />
          <Field
            label="Phone"
            value={employee?.phone}
          />
          <Field
            label="Address"
            value={employee?.address || "-"}
          />
        </Section>

        {/* EMPLOYMENT */}
        <Section title="Employment">
          <Field
            label="Designation"
            value={employee?.designation}
          />
          <Field
            label="Department"
            value={employee?.department}
          />
          <Field label="ID" value={empId || "-"} />
        </Section>

        {/* ACCOUNT LINKS */}
        <div className="mt-5 space-y-2.5">
          <Link
            to="/bank-account"
            className="flex items-center justify-between rounded-xl bg-white px-4 py-3.5 shadow-sm"
          >
            <span className="flex items-center gap-3 text-sm font-medium text-gray-800">
              <Landmark className="h-4 w-4 text-brand" />
              Bank Account
            </span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>

          <Link
            to="/esic"
            className="flex items-center justify-between rounded-xl bg-white px-4 py-3.5 shadow-sm"
          >
            <span className="flex items-center gap-3 text-sm font-medium text-gray-800">
              <ShieldCheck className="h-4 w-4 text-brand" />
              ESIC Details
            </span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-semibold text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-semibold text-gray-800">
        {title}
      </p>
      <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-sm text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}
