import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Payslip from "@/pages/Payslip";
import PayrollHistory from "@/pages/PayrollHistory";
import Profile from "@/pages/Profile";
import ESIC from "@/pages/ESIC";
import BankAccount from "@/pages/BankAccount";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <PayrollHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payslip/:payrollId"
          element={
            <ProtectedRoute>
              <Payslip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/esic"
          element={
            <ProtectedRoute>
              <ESIC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bank-account"
          element={
            <ProtectedRoute>
              <BankAccount />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
