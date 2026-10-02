import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileOutput,
  Landmark,
  ShieldCheck,
  User,
  ChevronRight,
  RefreshCcw,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";
import { BottomNav } from "@/components/BottomNav";
import {
  formatCurrency,
  greeting,
} from "@/lib/formatters";

interface SalaryHistoryRow {
  payrollId: string;
  month: string;
  periodEnd: string;
  netSalary: number;
  paymentStatus: string;
}

export default function Home() {
  const { employee } = useAuth();

  const [history, setHistory] = useState<
    SalaryHistoryRow[]
  >([]);
  const [loading, setLoading] = useState(true);

  const empId = employee?.employeeId || (employee as any)?.id;

  useEffect(() => {
    if (!empId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .get<SalaryHistoryRow[]>(
        API_CONFIG.ENDPOINTS.PAYROLL.HISTORY(empId),
      )
      .then((res) => {
        setHistory(res.data || []);
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, [empId]);

  const latest = history[0];

  const quickActions = [
    { to: "/payroll", label: "Payslip", icon: FileOutput },
    { to: "/bank-account", label: "Bank Account", icon: Landmark },
    { to: "/esic", label: "ESIC", icon: ShieldCheck },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        {/* HEADER */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {greeting()},
            </p>
            <h1 className="text-lg font-bold text-gray-900">
              {employee?.name || "Employee"} 👋
            </h1>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
            ID: {empId || "-"}
          </span>
        </div>

        {/* NET PAY CARD */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-light to-brand-dark p-6 text-white shadow-lg shadow-brand/20">
          <p className="text-center text-sm text-white/80">
            Total Net Pay
          </p>
          <p className="mt-1 text-center text-3xl font-bold">
            {loading
              ? "—"
              : formatCurrency(latest?.netSalary)}
          </p>
          {latest && (
            <Link
              to={`/payslip/${latest.payrollId}`}
              className="mt-4 block rounded-xl bg-white py-3 text-center text-sm font-semibold text-brand-dark"
            >
              View Payslip
            </Link>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-gray-800">
            Quick Actions
          </p>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex flex-col items-center gap-2"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <action.icon className="h-5 w-5" />
                </span>
                <span className="text-center text-[11px] font-medium text-gray-600">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* RECENT PAYROLL */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Recent Payroll
            </p>
            <Link
              to="/payroll"
              className="text-xs font-medium text-brand"
            >
              View more
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-sm text-gray-400">
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : history.length === 0 ? (
            <p className="rounded-xl bg-white py-8 text-center text-sm text-gray-400">
              No payroll records yet.
            </p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 3).map((row) => (
                <Link
                  key={row.payrollId}
                  to={`/payslip/${row.payrollId}`}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <FileOutput className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {row.month}
                      </p>
                      <p className="text-xs text-gray-400">
                        Salary Credited
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(row.netSalary)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
