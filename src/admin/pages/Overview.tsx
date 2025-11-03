/**
 * Overview page - Modern Glassy Dashboard
 * Beautiful dashboard with glass morphism and smooth animations
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '../components/StatCard';
import { formatCurrency } from '../types/common';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  HomeIcon,
  UsersIcon,
  BellAlertIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import tenantsData from '../mock/tenants.json';
import accountsData from '../mock/accounts.json';
import alertsData from '../mock/alerts.json';
import vendorsData from '../mock/vendors.json';
import financeMonthlyData from '../mock/finance-monthly.json';

/**
 * Modern glassy overview dashboard page
 */
const Overview: React.FC = () => {
  const [stats, setStats] = useState({
    activeTenants: 0,
    openAlerts: 0,
    monthlyRevenue: 0,
    activeVendors: 0,
    occupancyRate: 0,
  });

  useEffect(() => {
    // Calculate stats from mock data
    const activeTenants = tenantsData.filter((t) => t.status === 'Active').length;
    const openAlerts = alertsData.filter((a) => a.status === 'open').length;
    const activeVendors = vendorsData.filter((v) => v.status === 'Active').length;
    
    // Calculate current month revenue
    const currentMonthIncome = accountsData
      .filter((a) => a.type === 'Rent' || a.type === 'Deposit')
      .reduce((sum, a) => sum + a.amount, 0);
    
    // Calculate occupancy (assuming 100 total beds)
    const totalBeds = 100;
    const occupancyRate = Math.round((activeTenants / totalBeds) * 100);

    setStats({
      activeTenants,
      openAlerts,
      monthlyRevenue: currentMonthIncome,
      activeVendors,
      occupancyRate,
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-white/20 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-blue-600  mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-slate-600 text-lg">
              Here's what's happening with your hostels today.
            </p>
          </div>
          <motion.div
            animate={{
              rotate: [0, 10, 0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl"
          >
            🏨
          </motion.div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={<HomeIcon className="w-6 h-6 text-white" />}
          variant="primary"
          trend={{ value: '+5% from last month', isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Active Tenants"
          value={stats.activeTenants}
          icon={<UsersIcon className="w-6 h-6 text-white" />}
          variant="success"
          delay={0.1}
        />
        <StatCard
          title="Open Alerts"
          value={stats.openAlerts}
          icon={<BellAlertIcon className="w-6 h-6 text-white" />}
          variant={stats.openAlerts > 5 ? 'warning' : 'default'}
          delay={0.2}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />}
          variant="success"
          trend={{ value: '+12% from last month', isPositive: true }}
          delay={0.3}
        />
        <StatCard
          title="Active Vendors"
          value={stats.activeVendors}
          icon={<UserGroupIcon className="w-6 h-6 text-white" />}
          variant="default"
          delay={0.4}
        />
        <StatCard
          title="Pending Payments"
          value={accountsData.filter((a) => a.status === 'Pending').length}
          icon={<ClockIcon className="w-6 h-6 text-white" />}
          variant="warning"
          delay={0.5}
        />
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-8 border border-white/20 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Monthly Revenue Trend
            </h2>
            <p className="text-slate-600 mt-1">Track your income and expenses over time</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-500"></div>
              <span className="text-sm text-slate-600 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-600 font-medium">Expenses</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={financeMonthlyData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px', fontWeight: 600 }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px', fontWeight: 600 }} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 600 }} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Income"
              fill="url(#colorIncome)"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              name="Expenses"
              fill="url(#colorExpense)"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-8 border border-white/20 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {alertsData.slice(0, 5).map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + idx * 0.05 }}
              whileHover={{ x: 8, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              className="flex items-start gap-4 p-6 rounded-xl glass cursor-pointer transition-all group"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                  alert.severity === 'danger'
                    ? 'bg-gradient-to-br from-red-500 to-rose-600'
                    : alert.severity === 'warn'
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : 'bg-gradient-to-br from-brand-500 to-purple-600'
                }`}
              >
                <BellAlertIcon className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {alert.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {alert.description || 'No additional details'}
                </p>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                  <ClockIcon className="w-3 h-3" />
                  {new Date(alert.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
