import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ChartBarIcon,
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  BellAlertIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon,
  HomeIcon,
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
  {
    label: "People",
    path: "/admin/people",
    icon: UsersIcon,
    children: [
      { label: "Tenants", path: ROUTES.TENANTS, icon: HomeIcon },
      { label: "Employees", path: ROUTES.EMPLOYEES, icon: BriefcaseIcon },
    ],
  },
  { label: "Accounts", path: ROUTES.ACCOUNTS, icon: CurrencyDollarIcon },
  { label: "Hostel Management", path: ROUTES.HOSTEL, icon: BuildingOfficeIcon },
  { label: "Alerts", path: ROUTES.ALERTS, icon: BellAlertIcon },
  { label: "Vendor", path: ROUTES.VENDOR, icon: UserGroupIcon },
  { label: "Communication", path: ROUTES.COMM, icon: ChatBubbleLeftRightIcon },
  { label: "FP&A", path: ROUTES.FPA, icon: PresentationChartLineIcon },
  { label: "Settings", path: ROUTES.SETTINGS, icon: Cog6ToothIcon },
];

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const [openItem, setOpenItem] = useState<string>("/admin/people");

  const toggleOpen = (path: string) => {
    setOpenItem(openItem === path ? "" : path);
  };

  return (
    <aside
      className={`h-screen ${
        isCollapsed ? "w-20" : "w-64"
      } bg-white/80 backdrop-blur-md border-r border-blue-100 shadow-xl flex flex-col transition-all duration-300`}
    >
      {/* --- Logo Section --- */}
      <div className="h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white border-b border-blue-100 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">
            H
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold">Hostel Manager</h1>
              <p className="text-xs text-blue-100">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openItem === item.path;

          return (
            <div key={item.path}>
              {/* Parent Item - NavLink or Button */}
              {hasChildren ? (
                <button
                  onClick={() => toggleOpen(item.path)}
                  className={`w-full flex items-center ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } px-6 py-3.5 rounded-lg text-base font-semibold text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-200`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <span
                      className={`text-gray-500 transition-transform duration-300 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center ${
                      isCollapsed ? "justify-center" : "justify-start"
                    } px-5 py-3.5 rounded-lg text-base font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700"
                    }`
                  }
                >
                  <div className="flex items-center gap-4">
                    <Icon className={`w-6 h-6 pl-3 ${!isCollapsed ? "" : "mx-auto"}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                </NavLink>
              )}

              {/* Children Items - Enhanced Dropdown */}
              {hasChildren && isOpen && !isCollapsed && (
                <div className="ml-3 mt-3 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg p-2 border-l-4 border-blue-400">
                  <div className="space-y-2">
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-md text-[15px] font-semibold transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                : "text-gray-700 hover:bg-white hover:text-blue-700 hover:shadow-sm"
                            }`
                          }
                        >
                          <ChildIcon className="w-5 h-5" />
                          {child.label}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* --- Footer Profile --- */}
      <div className="p-4 border-t border-blue-100 bg-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold shadow-md">
            AD
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@hostel.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
