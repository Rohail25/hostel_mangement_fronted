import React from "react";
import { NavLink } from "react-router-dom";
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  BellAlertIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import ROUTES from "../routes/routePaths";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: "Overview", path: ROUTES.OVERVIEW, icon: ChartBarIcon },
  { label: "People", path: ROUTES.PEOPLE, icon: UsersIcon },
  { label: "Accounts", path: ROUTES.ACCOUNTS, icon: CurrencyDollarIcon },
  { label: "Hostel Management", path: ROUTES.HOSTEL, icon: BuildingOfficeIcon },
  { label: "Alerts", path: ROUTES.ALERTS, icon: BellAlertIcon },
  { label: "Vendor", path: ROUTES.VENDOR, icon: UserGroupIcon },
  { label: "Communication", path: ROUTES.COMM, icon: ChatBubbleLeftRightIcon },
  { label: "FP&A", path: ROUTES.FPA, icon: PresentationChartLineIcon },
  { label: "Settings", path: ROUTES.SETTINGS, icon: Cog6ToothIcon },
];

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {

  return (
    <aside
      className={`h-screen ${
        isCollapsed ? "w-20" : "w-64"
      } bg-[#1A2B4D] flex flex-col transition-all duration-300 font-sans`}
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      {/* --- Logo Section --- */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Door Icon - Split Pink/Green */}
          <div className="flex rounded-lg overflow-hidden">
            <div className="w-5 h-5 bg-[#FF3380]"></div>
            <div className="w-5 h-5 bg-[#00FF88]"></div>
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Hostel Manager
            </h1>
          )}
        </div>
        {/* {!isCollapsed && (
          <MagnifyingGlassIcon className="w-5 h-5 text-white cursor-pointer hover:opacity-80 transition-opacity" />
        )} */}
      </div>

      {/* --- Create New Button --- */}
      {!isCollapsed && (
        <div className="px-4 py-4">
          <button className="w-full flex items-center justify-center gap-2 bg-[#FF3380] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#FF1A6E] transition-colors shadow-sm">
            <PlusIcon className="w-5 h-5" />
            <span>Create New</span>
          </button>
        </div>
      )}

      {/* --- Navigation --- */}
      <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center ${
                  isCollapsed ? "justify-center" : "justify-start"
                } px-4 py-3 rounded-lg text-base font-normal text-white transition-all duration-200 ${
                  isActive
                    ? "bg-[#2176FF] text-white"
                    : "hover:bg-white/10 text-white"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isCollapsed ? "mx-auto" : ""}`} />
                {!isCollapsed && <span className="font-sans">{item.label}</span>}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* --- Footer Profile --- */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold">
            AD
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-white/70">admin@hostel.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
