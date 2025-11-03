/**
 * FinanceDashboard page
 * Financial Planning & Analysis with charts
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { StatCard } from '../../components/StatCard';
import { formatCurrency } from '../../types/common';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import financeMonthlyData from '../../mock/finance-monthly.json';
import financeYearlyData from '../../mock/finance-yearly.json';

type ViewType = 'monthly' | 'yearly';

/**
 * Finance dashboard page
 */
const FinanceDashboard: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('monthly');
  // Calculate KPIs
  const kpis = useMemo(() => {
    // Current year data
    const currentYear = financeYearlyData[financeYearlyData.length - 1];
    const netIncome = currentYear.income - currentYear.expenses;

    // Monthly averages
    const avgMonthlyIncome =
      financeMonthlyData.reduce((sum, m) => sum + m.income, 0) /
      financeMonthlyData.length;
    const avgMonthlyExpenses =
      financeMonthlyData.reduce((sum, m) => sum + m.expenses, 0) /
      financeMonthlyData.length;

    // Year-over-year growth
    const previousYear = financeYearlyData[financeYearlyData.length - 2];
    const yoyGrowth = previousYear
      ? ((currentYear.income - previousYear.income) / previousYear.income) * 100
      : 0;

    return {
      netIncome,
      totalIncome: currentYear.income,
      totalExpenses: currentYear.expenses,
      avgMonthlyIncome,
      avgMonthlyExpenses,
      yoyGrowth,
    };
  }, []);

  // Prepare monthly data with net calculation
  const monthlyDataWithNet = financeMonthlyData.map((m) => ({
    ...m,
    net: m.income - m.expenses,
  }));

  // Prepare yearly data with net calculation
  const yearlyDataWithNet = financeYearlyData.map((y) => ({
    ...y,
    net: y.income - y.expenses,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Financial Planning & Analysis
        </h1>
        <p className="text-slate-600 mt-1">
          Comprehensive financial overview and insights
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Net Income YTD"
          value={formatCurrency(kpis.netIncome)}
          icon="💵"
          variant="success"
          trend={{
            value: `${kpis.yoyGrowth.toFixed(1)}% YoY`,
            isPositive: kpis.yoyGrowth > 0,
          }}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(kpis.totalIncome)}
          icon="📈"
          variant="primary"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(kpis.totalExpenses)}
          icon="📉"
          variant="warning"
        />
        <StatCard
          title="Avg Monthly Income"
          value={formatCurrency(kpis.avgMonthlyIncome)}
          icon="💰"
          variant="default"
        />
      </div>

      {/* Income vs Expenses Chart with Toggle */}
      <div className="glass p-6 rounded-2xl border border-white/20 shadow-xl">
        {/* Header with Toggle Buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Income vs Expenses
          </h2>
          
          {/* Toggle Buttons */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewType('monthly')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                viewType === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              Monthly
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewType('yearly')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                viewType === 'yearly'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ChartBarIcon className="w-5 h-5" />
              Yearly
            </motion.button>
          </div>
        </div>

        {/* Chart Area */}
        <motion.div
          key={viewType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            {viewType === 'monthly' ? (
              <LineChart data={monthlyDataWithNet}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Expenses"
                  fill="url(#colorExpense)"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="#16a34a"
                  strokeWidth={3}
                  name="Net Profit"
                  fill="url(#colorNet)"
                  dot={{ fill: '#16a34a', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            ) : (
              <BarChart data={yearlyDataWithNet}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 600 }} />
                <Bar 
                  dataKey="income" 
                  fill="#3b82f6" 
                  name="Income"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="expenses" 
                  fill="#ef4444" 
                  name="Expenses"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="net" 
                  fill="#16a34a" 
                  name="Net Profit"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Info Text */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900 font-medium">
            {viewType === 'monthly' 
              ? '📊 Showing monthly breakdown of income, expenses, and net profit for the current year'
              : '📈 Showing yearly comparison of income, expenses, and net profit across multiple years'
            }
          </p>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Key Financial Ratios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-600 mb-2">Profit Margin</p>
            <p className="text-3xl font-bold text-slate-900">
              {((kpis.netIncome / kpis.totalIncome) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">Expense Ratio</p>
            <p className="text-3xl font-bold text-slate-900">
              {((kpis.totalExpenses / kpis.totalIncome) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">YoY Growth</p>
            <p
              className={`text-3xl font-bold ${
                kpis.yoyGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {kpis.yoyGrowth > 0 ? '+' : ''}
              {kpis.yoyGrowth.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;

