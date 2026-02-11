/**
 * FinanceDashboard page
 * Financial Planning & Analysis with comprehensive reporting
 */

import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowDownTrayIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { StatCard } from '../../components/StatCard';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../types/common';
import { useCurrency } from '../../context/CurrencyContext';
import ROUTES from '../../routes/routePaths';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  getFPASummary,
  getMonthlyComparison,
  getCategoryBreakdown,
  getCashFlow,
  getFinancialRatios,
  downloadFPAPDF,
} from '../../services/fpa.service';

type ViewType = 'monthly' | 'yearly';

/**
 * Finance dashboard page
 */
const FinanceDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currencySymbol } = useCurrency();
  const currentYear = new Date().getFullYear();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [ratiosData, setRatiosData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  // Get active view type from route
  const getActiveViewType = (): ViewType => {
    if (location.pathname.includes('/fpa/yearly')) return 'yearly';
    return 'monthly'; // default to monthly
  };

  const viewType = getActiveViewType();

  // Redirect /admin/fpa to /admin/fpa/monthly
  useEffect(() => {
    if (location.pathname === ROUTES.FPA) {
      navigate(ROUTES.FPA_MONTHLY, { replace: true });
    }
  }, [location.pathname, navigate]);

  // Fetch FP&A data based on view type
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (viewType === 'monthly') {
          // Monthly View: Fetch current month or selected month data
          const monthToFetch = selectedMonth || currentMonth;
          
          const [summary, monthly, categories, cashFlow, ratios] = await Promise.all([
            getFPASummary({ year: selectedYear, month: monthToFetch }),
            getMonthlyComparison({ year: selectedYear }),
            getCategoryBreakdown({ year: selectedYear, month: monthToFetch }),
            getCashFlow({ year: selectedYear }),
            getFinancialRatios({ year: selectedYear }),
          ]);

          setSummaryData(summary.data);
          setMonthlyData(monthly.data.monthlyData);
          setCategoryData(categories.data);
          setCashFlowData(cashFlow.data.cashFlow);
          setRatiosData(ratios.data);
        } else {
          // Yearly View: Fetch year data only (all months aggregated)
          const [summary, monthly, categories, cashFlow, ratios] = await Promise.all([
            getFPASummary({ year: selectedYear }),
            getMonthlyComparison({ year: selectedYear }),
            getCategoryBreakdown({ year: selectedYear }),
            getCashFlow({ year: selectedYear }),
            getFinancialRatios({ year: selectedYear }),
          ]);

          setSummaryData(summary.data);
          setMonthlyData(monthly.data.monthlyData);
          setCategoryData(categories.data);
          setCashFlowData(cashFlow.data.cashFlow);
          setRatiosData(ratios.data);
        }
      } catch (err: any) {
        console.error('Error fetching FP&A data:', err);
        setError(err?.message || 'Failed to load financial data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, viewType, selectedMonth]);

  // Map category breakdown for charts
  const categoryBreakdown = useMemo(() => {
    if (!categoryData) {
      return { income: [], expenses: [] };
    }

    const incomeCategories = (categoryData.income.categories || []).map((cat: any) => ({
      name: cat.name || cat.category || 'Unknown',
      value: cat.value || cat.amount || 0,
    }));

    const expenseCategories = (categoryData.expenses.categories || []).map((cat: any) => ({
      name: cat.name || cat.category || 'Unknown',
      value: cat.value || cat.amount || 0,
    }));

    return {
      income: incomeCategories,
      expenses: expenseCategories,
    };
  }, [categoryData]);

  // Calculate monthly data with comparisons
  const monthlyDataWithComparison = useMemo(() => {
    return monthlyData.map((month, index) => {
      const prevMonth = index > 0 ? monthlyData[index - 1] : null;
      return {
        month: month.monthName,
        income: month.income,
        expenses: month.expense,
        net: month.netIncome,
        incomeChange: prevMonth ? month.income - prevMonth.income : 0,
        expenseChange: prevMonth ? month.expense - prevMonth.expense : 0,
        netChange: prevMonth ? month.netIncome - prevMonth.netIncome : 0,
      };
    });
  }, [monthlyData]);

  // Calculate KPIs from summary data
  const kpis = useMemo(() => {
    if (!summaryData) {
      return {
        netIncome: 0,
        monthlyNet: 0,
        totalIncome: 0,
        totalExpenses: 0,
        yoyGrowth: 0,
      };
    }

    const keyMetrics = summaryData.keyMetrics || {};
    const summary = summaryData.summary || {};

    return {
      netIncome: keyMetrics.netIncome?.value || summary.netIncome || 0,
      monthlyNet: summary.netIncome || 0,
      totalIncome: keyMetrics.totalRevenue?.value || summary.totalIncome || 0,
      totalExpenses: keyMetrics.totalExpenses?.value || summary.totalExpense || 0,
      yoyGrowth: keyMetrics.netIncome?.yoyGrowth || summary.yoyGrowth || 0,
    };
  }, [summaryData]);

  // Break even analysis from summary
  const breakEven = useMemo(() => {
    if (!summaryData?.breakEvenAnalysis) {
      return {
        breakEvenRevenue: 0,
        marginOfSafety: 0,
        marginOfSafetyPercent: 0,
        contributionMargin: 0,
        contributionMarginRatio: 0,
      };
    }

    const bea = summaryData.breakEvenAnalysis;
    return {
      breakEvenRevenue: bea.breakEvenRevenue || 0,
      marginOfSafety: bea.marginOfSafety?.value || 0,
      marginOfSafetyPercent: bea.marginOfSafety?.percentage || 0,
      contributionMargin: bea.contributionMargin || 0,
      contributionMarginRatio: bea.contributionMarginRatio || 0,
    };
  }, [summaryData]);

  // Cash flow analysis - map API data
  const cashFlow = useMemo(() => {
    return cashFlowData.map((item: any) => ({
      month: item.month || item.monthAbbr || item.monthName,
      income: item.income || 0,
      expenses: item.expense || item.expenses || 0,
      netCashFlow: item.net || item.netIncome || 0,
      cumulative: item.cumulative || item.cumulativeCashFlow || 0,
    }));
  }, [cashFlowData]);

  // Financial ratios from API
  const ratios = useMemo(() => {
    if (!ratiosData?.ratios) {
      return {
        profitMargin: 0,
        expenseRatio: 0,
        currentRatio: 'N/A',
        operatingExpenseRatio: 0,
        returnOnRevenue: 0,
      };
    }

    const r = ratiosData.ratios;
    return {
      profitMargin: r.profitMargin?.value || 0,
      expenseRatio: r.expenseRatio?.value || 0,
      currentRatio: r.currentRatio?.value || 0,
      operatingExpenseRatio: r.operatingExpenseRatio?.value || 0,
      returnOnRevenue: r.returnOnRevenue?.value || 0,
    };
  }, [ratiosData]);

  // Additional KPIs from summary
  const additionalKPIs = useMemo(() => {
    if (!summaryData?.performanceMetrics) {
      return {
        netProfitGrowth: 0,
        collectionEfficiency: 0,
        revPAU: 0,
        monthlyRevPAU: 0,
        contributionMarginRatio: 0,
        monthlyBills: 0,
        monthlyRent: 0,
        totalPayable: 0,
      };
    }

    const pm = summaryData.performanceMetrics;
    return {
      netProfitGrowth: pm.netProfitGrowth || 0,
      collectionEfficiency: pm.collectionEfficiency || 0,
      revPAU: pm.annualRevPAU || 0,
      monthlyRevPAU: pm.monthlyRevPAU || 0,
      contributionMarginRatio: pm.contributionMarginRatio || 0,
      monthlyBills: pm.monthlyBills || 0,
      monthlyRent: pm.monthlyRent || 0,
      totalPayable: pm.totalPayable || 0,
    };
  }, [summaryData]);

  // Get selected month details from monthly data
  const selectedMonthData = useMemo(() => {
    if (!selectedMonth || monthlyData.length === 0) {
      return null;
    }
    return monthlyData.find(m => m.month === selectedMonth);
  }, [selectedMonth, monthlyData]);

  // Display KPIs - always use the additionalKPIs from latest API call
  // The API already returns the correct values for the selected month when month parameter is passed
  const displayKPIs = useMemo(() => {
    return additionalKPIs;
  }, [additionalKPIs]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Handle chart click to show details for selected month
  const handleChartClick = (monthData: any) => {
    if (monthData && monthData.month) {
      setSelectedMonth(parseInt(monthData.month));
    }
  };

  // PDF Export function - use API endpoint
  const handleExportPDF = async () => {
    try {
      await downloadFPAPDF({
        year: selectedYear,
        viewType: viewType,
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading financial data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="fpa-report">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Financial Planning & Analysis
          </h1>
          <p className="text-slate-600 mt-1">
            Comprehensive financial overview and insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <Button
            variant="primary"
            onClick={handleExportPDF}
            icon={ArrowDownTrayIcon}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* View Type Tabs & Month Selector */}
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1">
          <div className="flex gap-2">
            <button
              onClick={() => navigate(ROUTES.FPA_MONTHLY)}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                viewType === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-gray-100'
              }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => navigate(ROUTES.FPA_YEARLY)}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                viewType === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-gray-100'
              }`}
            >
              Yearly View
            </button>
          </div>
        </div>

        {/* Month Selector - Only show in monthly view */}
        {viewType === 'monthly' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Select Month</p>
                <p className="text-xs text-slate-500">
                  {selectedMonth ? `Month ${selectedMonth}` : `Current: Month ${currentMonth}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth || currentMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {[
                    { num: 1, name: 'January' },
                    { num: 2, name: 'February' },
                    { num: 3, name: 'March' },
                    { num: 4, name: 'April' },
                    { num: 5, name: 'May' },
                    { num: 6, name: 'June' },
                    { num: 7, name: 'July' },
                    { num: 8, name: 'August' },
                    { num: 9, name: 'September' },
                    { num: 10, name: 'October' },
                    { num: 11, name: 'November' },
                    { num: 12, name: 'December' },
                  ].map((month) => (
                    <option key={month.num} value={month.num}>
                      {month.name} ({selectedYear})
                    </option>
                  ))}
                </select>
                {selectedMonth && (
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="px-3 py-2 text-sm text-slate-600 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Net Income"
          value={formatCurrency(viewType === 'monthly' ? kpis.monthlyNet : kpis.netIncome, currencySymbol)}
          icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />}
          variant="success"
          trend={{
            value: `${kpis.yoyGrowth.toFixed(1)}% YoY`,
            isPositive: kpis.yoyGrowth > 0,
          }}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(kpis.totalIncome, currencySymbol)}
          icon={<ChartBarIcon className="w-6 h-6 text-white" />}
          variant="primary"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(kpis.totalExpenses, currencySymbol)}
          icon={<ChartBarIcon className="w-6 h-6 text-white" />}
          variant="warning"
        />
        <StatCard
          title="Profit Margin"
          value={`${ratios.profitMargin.toFixed(1)}%`}
          icon={<ArrowTrendingUpIcon className="w-6 h-6 text-white" />}
          variant={ratios.profitMargin > 0 ? 'success' : 'danger'}
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6">
          {/* Monthly View */}
          {viewType === 'monthly' && (
            <div className="space-y-6">
              {/* Income vs Expenses Chart with Month-to-Month Comparison */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Month-to-Month Comparison
                </h2>
                <p className="text-sm text-slate-500 mb-4">Click on a bar to see details for that month</p>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart 
                    data={monthlyDataWithComparison}
                    onClick={(state: any) => {
                      if (state && state.activeTooltipIndex !== undefined) {
                        const monthData = monthlyDataWithComparison[state.activeTooltipIndex];
                        handleChartClick(monthData);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, currencySymbol)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Net Income"
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Categories */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Income Categories</h3>
                  {categoryBreakdown.income.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryBreakdown.income}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryBreakdown.income.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-2">
                        {categoryBreakdown.income.map((item, index) => (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-slate-600">{item.name}</span>
                            </div>
                            <span className="font-medium text-slate-900">{formatCurrency(item.value, currencySymbol)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      No income categories available
                    </div>
                  )}
                </div>

                {/* Expense Categories */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Expense Categories</h3>
                  {categoryBreakdown.expenses.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryBreakdown.expenses}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryBreakdown.expenses.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-2">
                        {categoryBreakdown.expenses.map((item, index) => (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-slate-600">{item.name}</span>
                            </div>
                            <span className="font-medium text-slate-900">{formatCurrency(item.value, currencySymbol)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      No expense categories available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Yearly View */}
          {viewType === 'yearly' && (
            <div className="space-y-6">
              {/* Year-to-Year Comparison - Using monthly data aggregated */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Year Overview - Monthly Breakdown
                </h2>
                <p className="text-sm text-slate-500 mb-4">Click on a bar to see details for that month</p>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart 
                    data={monthlyDataWithComparison}
                    onClick={(state: any) => {
                      if (state && state.activeTooltipIndex !== undefined) {
                        const monthData = monthlyDataWithComparison[state.activeTooltipIndex];
                        handleChartClick(monthData);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, currencySymbol)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Net Income"
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Break Even Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Break Even Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-900 mb-2">Break Even Revenue</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(breakEven.breakEvenRevenue, currencySymbol)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-900 mb-2">Margin of Safety</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(breakEven.marginOfSafety, currencySymbol)}
            </p>
            <p className="text-xs text-green-700 mt-1">
              ({breakEven.marginOfSafetyPercent.toFixed(1)}%)
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-900 mb-2">Contribution Margin</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(breakEven.contributionMargin, currencySymbol)}
            </p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-900 mb-2">Contribution Margin Ratio</p>
            <p className="text-2xl font-bold text-indigo-600">
              {breakEven.contributionMarginRatio.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Additional KPIs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Additional Performance Metrics</h2>
          {selectedMonthData && (
            <button
              onClick={() => setSelectedMonth(null)}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Clear Selection ({selectedMonthData.monthName || `Month ${selectedMonth}`})
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Net Profit Growth</p>
            <p
              className={`text-2xl font-bold ${
                displayKPIs.netProfitGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {displayKPIs.netProfitGrowth > 0 ? '+' : ''}
              {displayKPIs.netProfitGrowth.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Collection Efficiency</p>
            <p className="text-2xl font-bold text-slate-900">
              {displayKPIs.collectionEfficiency.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Rent Collection Rate</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Monthly Bills</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(displayKPIs.monthlyBills, currencySymbol)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total Revenue</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Monthly Rent</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(displayKPIs.monthlyRent, currencySymbol)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Per Unit/Month</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Total Payable</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(displayKPIs.totalPayable, currencySymbol)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total Rent Due</p>
          </div>
        </div>
      </div>

      {/* Cash Flow */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Cash Flow Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={cashFlow}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Cumulative Cash Flow"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Ratios */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Financial Ratios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Profit Margin</p>
            <p className="text-3xl font-bold text-slate-900">
              {ratios.profitMargin.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Net Profit / Revenue</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Expense Ratio</p>
            <p className="text-3xl font-bold text-slate-900">
              {ratios.expenseRatio.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Expenses / Revenue</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Current Ratio</p>
            <p className="text-3xl font-bold text-slate-900">
              {typeof ratios.currentRatio === 'number' ? ratios.currentRatio.toFixed(2) : ratios.currentRatio}
            </p>
            <p className="text-xs text-slate-500 mt-1">Income / Expenses</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Operating Expense Ratio</p>
            <p className="text-3xl font-bold text-slate-900">
              {ratios.operatingExpenseRatio.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Operating Costs / Revenue</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Return on Revenue</p>
            <p className="text-3xl font-bold text-slate-900">
              {ratios.returnOnRevenue.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-1">ROI from Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
