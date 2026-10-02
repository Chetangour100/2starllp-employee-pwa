export const API_CONFIG = {
  BASE_URL:
    (import.meta as any).env?.VITE_API_BASE_URL ||
    "http://localhost:3000/api",

  ENDPOINTS: {
    EMPLOYEE_AUTH: {
      LOGIN: "/employees/login",
      CHANGE_PASSWORD: "/employees/change-password",
      FORGOT_PASSWORD: "/employees/forgot-password",
      VERIFY_OTP: "/employees/verify-reset-otp",
      RESET_PASSWORD: "/employees/reset-password",
    },

    EMPLOYEE: {
      DETAIL: (id: string) => `/employees/${id}`,
      UPDATE: (id: string) => `/employees/${id}`,
    },

    PAYROLL: {
      // Full salary history for one employee across all
      // payroll runs (already built for the admin dashboard,
      // reused here as-is).
      HISTORY: (employeeId: string) =>
        `/payrolls/employee/${employeeId}`,

      PAYSLIP: (payrollId: string, employeeId: string) =>
        `/payrolls/${payrollId}/payslip/${employeeId}`,
    },
  },
};
