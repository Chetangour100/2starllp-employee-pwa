import { NavLink } from "react-router-dom";
import { Home, FileOutput, ShieldCheck } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/payroll", label: "Payroll", icon: FileOutput, end: false },
  {
    to: "/esic",
    label: "ESIC Detail",
    icon: ShieldCheck,
    end: false,
  },
];

export function BottomNav() {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
      <nav className="flex items-center justify-around rounded-full border border-gray-100 bg-white py-2 shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "text-brand"
                  : "text-gray-400"
              }`
            }
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
