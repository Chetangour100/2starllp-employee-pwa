import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";
import { BottomNav } from "@/components/BottomNav";
import { formatCurrency } from "@/lib/formatters";

interface SalaryHistoryRow {
  payrollId: string;
  month: string;
  periodStart: string;
  monthlySalary: number;
  netSalary: number;
  paymentStatus: string;
}

export default function PayrollHistory() {
  const { employee } = useAuth();
  const [history, setHistory] = useState<
    SalaryHistoryRow[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<
    number | null
  >(null);

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
        const rows = res.data || [];
        setHistory(rows);

        if (rows.length > 0) {
          const years = rows.map((r) =>
            new Date(r.periodStart).getFullYear(),
          );
          setSelectedYear(Math.max(...years));
        }
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, [empId]);

  const years = useMemo(() => {
    const set = new Set(
      history.map((r) =>
        new Date(r.periodStart).getFullYear(),
      ),
    );
    const list = Array.from(set).sort();
    const currentYear = new Date().getFullYear();
    if (!list.includes(currentYear)) {
      list.push(currentYear);
    }
    return list.sort();
  }, [history]);

  const filtered = history.filter(
    (row) =>
      new Date(row.periodStart).getFullYear() ===
      selectedYear,
  );

  return (
    <div className="app-shell pb-28">
      <div className="px-5 pt-6">
        <h1 className="text-center text-lg font-bold text-gray-900">
          Payroll
        </h1>

        {/* YEAR TABS */}
        <div className="no-scrollbar mt-5 flex gap-5 overflow-x-auto border-b border-gray-100 pb-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`shrink-0 pb-1.5 text-sm font-medium transition-colors ${
                selectedYear === year
                  ? "border-b-2 border-brand text-brand"
                  : "text-gray-400"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-sm text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-xl bg-white py-10 text-center text-sm text-gray-400">
              No payroll records for {selectedYear}.
            </p>
          ) : (
            filtered.map((row) => (
              <div
                key={row.payrollId}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {row.month}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      row.paymentStatus === "Paid"
                        ? "bg-green-50 text-green-600"
                        : row.paymentStatus === "Failed"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {row.paymentStatus}
                  </span>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Net Pay
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(row.netSalary)}
                </p>

                <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="text-xs text-gray-500">
                    Gross Salary
                  </span>
                  <span className="text-xs font-semibold text-gray-700">
                    {formatCurrency(row.monthlySalary)}
                  </span>
                </div>

                <Link
                  to={`/payslip/${row.payrollId}`}
                  className="mt-3 flex items-center justify-between text-sm font-medium text-brand"
                >
                  View Payslip
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
