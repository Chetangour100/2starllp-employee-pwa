import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiClient, downloadPayslip } from "@/api/client";
import { API_CONFIG } from "@/api/config";
import { BottomNav } from "@/components/BottomNav";
import { formatCurrency } from "@/lib/formatters";

interface SalaryHistoryRow {
  payrollId: string;
  month: string;
  monthlySalary: number;
  netSalary: number;
  leaveDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  paymentStatus: string;
}

export default function Payslip() {
  const { payrollId } = useParams<{ payrollId: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();

  const [row, setRow] = useState<SalaryHistoryRow | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const empId = employee?.employeeId || (employee as any)?.id;

  useEffect(() => {
    if (!empId || !payrollId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .get<SalaryHistoryRow[]>(
        API_CONFIG.ENDPOINTS.PAYROLL.HISTORY(empId),
      )
      .then((res) => {
        const found = (res.data || []).find(
          (item) => item.payrollId === payrollId,
        );
        setRow(found || null);
      })
      .catch(() => {
        setRow(null);
      })
      .finally(() => setLoading(false));
  }, [empId, payrollId]);

  const handleDownload = async () => {
    if (!empId || !payrollId) return;
    try {
      setDownloading(true);
      await downloadPayslip(
        payrollId,
        empId,
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!row) {
    return (
      <div className="app-shell flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-500">
          Payslip not found.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm font-medium text-brand"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900">
            Payslip
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {row.month}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatCurrency(row.netSalary)}
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {row.paymentStatus === "Paid"
              ? "Payment processed"
              : row.paymentStatus}
          </span>
        </div>

        {/* EARNINGS */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-800">
            Earnings
          </p>
          <Row label="Monthly Salary" value={row.monthlySalary} />
          <div className="my-2 border-t border-dashed border-gray-200" />
          <Row
            label="Total Earnings"
            value={row.monthlySalary}
            bold
          />
        </div>

        {/* DEDUCTIONS */}
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-800">
            Deductions
          </p>
          <Row label="Leave Deduction" value={row.leaveDeduction} />
          <Row label="Other" value={row.otherDeductions} />
          <div className="my-2 border-t border-dashed border-gray-200" />
          <Row
            label="Total Deductions"
            value={row.totalDeductions}
            bold
          />
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-light to-brand-dark py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {downloading ? "Downloading..." : "Download payslip"}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span
        className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-500"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-700"}`}
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
}
