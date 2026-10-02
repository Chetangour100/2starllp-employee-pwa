import { API_CONFIG } from "./config";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

const TOKEN_KEY = "employee_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const token = getToken();

  const response = await fetch(
    `${API_CONFIG.BASE_URL}${path}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    },
  );

  let json: any = null;

  try {
    json = await response.json();
  } catch {
    // no JSON body (e.g. plain-text payslip download uses a
    // separate direct-fetch helper, not this wrapper)
  }

  if (!response.ok) {
    const message =
      json?.message ||
      json?.error ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return {
    success: json?.success ?? true,
    message: json?.message,
    data: json?.data,
  };
}

export const apiClient = {
  get: <T = any>(path: string) =>
    request<T>("GET", path),

  post: <T = any>(path: string, body?: unknown) =>
    request<T>("POST", path, body),

  put: <T = any>(path: string, body?: unknown) =>
    request<T>("PUT", path, body),

  patch: <T = any>(path: string, body?: unknown) =>
    request<T>("PATCH", path, body),
};

/**
 * Downloads the plain-text payslip file for a given payroll
 * run and triggers a browser download (used by Payslip and
 * Payroll History screens).
 */
export async function downloadPayslip(
  payrollId: string,
  employeeId: string,
) {
  const token = getToken();

  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYROLL.PAYSLIP(
    payrollId,
    employeeId,
  )}`;

  const response = await fetch(url, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  if (!response.ok) {
    throw new Error("Failed to download payslip");
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `payslip-${employeeId}-${payrollId}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(downloadUrl);
}
