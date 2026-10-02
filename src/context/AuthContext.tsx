import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { apiClient, setToken, clearToken } from "@/api/client";
import { API_CONFIG } from "@/api/config";

export interface EmployeeProfile {
  id?: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: string;
  salary: number;
  joiningDate: string;
  address?: string;
  city?: string;
  state?: string;
  emergencyContact?: string;
  panNumber?: string;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  esicNumber?: string;
  maritalStatus?: string;
}

interface AuthContextValue {
  employee: EmployeeProfile | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(
  null,
);

const EMPLOYEE_ID_KEY = "employee_id";

function normalizeEmployee(data: any): EmployeeProfile {
  const employeeId = data?.employeeId || data?.id || "";
  return {
    ...data,
    id: data?.id || employeeId,
    employeeId,
  };
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [employee, setEmployee] =
    useState<EmployeeProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchProfile = async (id: string) => {
    if (!id || id === "undefined" || id === "null") return;

    const response = await apiClient.get<any>(
      API_CONFIG.ENDPOINTS.EMPLOYEE.DETAIL(id),
    );

    if (response.data) {
      const normalized = normalizeEmployee(response.data);
      setEmployee(normalized);
      if (normalized.employeeId) {
        localStorage.setItem(EMPLOYEE_ID_KEY, normalized.employeeId);
      }
    }
  };

  useEffect(() => {
    const storedId = localStorage.getItem(EMPLOYEE_ID_KEY);

    if (!storedId || storedId === "undefined" || storedId === "null") {
      clearToken();
      localStorage.removeItem(EMPLOYEE_ID_KEY);
      setEmployee(null);
      setLoading(false);
      return;
    }

    fetchProfile(storedId)
      .catch(() => {
        // stored session is stale/invalid
        clearToken();
        localStorage.removeItem(EMPLOYEE_ID_KEY);
        setEmployee(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (
    phone: string,
    password: string,
  ) => {
    const response = await apiClient.post<{
      employee: any;
      token: string;
    }>(API_CONFIG.ENDPOINTS.EMPLOYEE_AUTH.LOGIN, {
      phone,
      password,
    });

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "Login failed",
      );
    }

    const normalized = normalizeEmployee(response.data.employee);
    setToken(response.data.token);
    if (normalized.employeeId) {
      localStorage.setItem(
        EMPLOYEE_ID_KEY,
        normalized.employeeId,
      );
    }
    setEmployee(normalized);
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem(EMPLOYEE_ID_KEY);
    setEmployee(null);
  };

  const refreshProfile = async () => {
    const empId = employee?.employeeId || (employee as any)?.id;
    if (empId) {
      await fetchProfile(empId);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        employee,
        loading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider",
    );
  }
  return ctx;
}
