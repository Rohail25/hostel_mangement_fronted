/**
 * Overview page - Professional Dashboard
 * Comprehensive dashboard with multiple data visualizations
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '../components/StatCard';
import { formatCurrency } from '../types/common';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
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
  BarChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  HandRaisedIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  UserIcon,
  BellAlertIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../components/Button';
import { getOverviewDashboard, type OverviewDashboardResponse } from '../services/dashboard.service';
import { getUnassignedAlertsAPI } from '../services/alert.service';
import jsPDF from 'jspdf';
import { api } from '../../services/apiClient';
import { addPDFBranding, addPDFHeader } from '../utils/pdfExport';

const DEFAULT_DASHBOARD_DATA: OverviewDashboardResponse['data'] = {
  summaryCards: [],
  overview: {
    occupancy: {
      occupied: 0,
      vacant: 0,
      occupiedPercent: 0,
      vacantPercent: 0,
      growth: '0%',
      totalUnits: 0,
      occupiedUnits: 0,
    },
    monthlyRevenue: {
      current: 0,
      growth: '0%',
      formatted: '0',
    },
    activeTenants: {
      count: 0,
      growth: '0%',
    },
    activeVendors: {
      count: 0,
      growth: '0%',
    },
    openAlerts: {
      count: 0,
      growth: '0%',
    },
    pendingPayments: {
      count: 0,
      growth: '0%',
    },
  },
  profitLoss: {
    totalNetIncome: 0,
    series: [],
  },
  employeeActivityLog: {
    total: 0,
    items: [],
  },
  transactions: {
    payable: {
      totalAmount: 0,
      totalFormatted: '0',
      count: 0,
      items: [],
    },
    receivable: {
      totalAmount: 0,
      totalFormatted: '0',
      count: 0,
      items: [],
    },
  },
  recentBills: [],
  recentMaintenance: [],
  unpaidRent: {
    totalAmount: 0,
    totalFormatted: '0',
    aging: [],
    tenants: [],
    summary: {
      paidCount: 0,
      unpaidCount: 0,
    },
  },
  checkInCheckOut: {
    checkIns: {
      count: 0,
      period: '',
    },
    checkOuts: {
      count: 0,
      period: '',
    },
    total: 0,
  },
  meta: {
    hostelId: null,
    currency: 'NGN',
    generatedAt: '',
  },
};

const normalizeDashboardData = (
  data?: Partial<OverviewDashboardResponse['data']> | null
): OverviewDashboardResponse['data'] => {
  const source = data || {};

  return {
    ...DEFAULT_DASHBOARD_DATA,
    ...source,
    summaryCards: Array.isArray(source.summaryCards) ? source.summaryCards : [],
    overview: {
      ...DEFAULT_DASHBOARD_DATA.overview,
      ...(source.overview || {}),
      occupancy: {
        ...DEFAULT_DASHBOARD_DATA.overview.occupancy,
        ...(source.overview?.occupancy || {}),
      },
      monthlyRevenue: {
        ...DEFAULT_DASHBOARD_DATA.overview.monthlyRevenue,
        ...(source.overview?.monthlyRevenue || {}),
      },
      activeTenants: {
        ...DEFAULT_DASHBOARD_DATA.overview.activeTenants,
        ...(source.overview?.activeTenants || {}),
      },
      activeVendors: {
        ...DEFAULT_DASHBOARD_DATA.overview.activeVendors,
        ...(source.overview?.activeVendors || {}),
      },
      openAlerts: {
        ...DEFAULT_DASHBOARD_DATA.overview.openAlerts,
        ...(source.overview?.openAlerts || {}),
      },
      pendingPayments: {
        ...DEFAULT_DASHBOARD_DATA.overview.pendingPayments,
        ...(source.overview?.pendingPayments || {}),
      },
    },
    profitLoss: {
      ...DEFAULT_DASHBOARD_DATA.profitLoss,
      ...(source.profitLoss || {}),
      series: Array.isArray(source.profitLoss?.series) ? source.profitLoss!.series : [],
    },
    employeeActivityLog: {
      ...DEFAULT_DASHBOARD_DATA.employeeActivityLog,
      ...(source.employeeActivityLog || {}),
      items: Array.isArray(source.employeeActivityLog?.items)
        ? source.employeeActivityLog!.items
        : [],
    },
    transactions: {
      payable: {
        ...DEFAULT_DASHBOARD_DATA.transactions.payable,
        ...(source.transactions?.payable || {}),
        items: Array.isArray(source.transactions?.payable?.items)
          ? source.transactions!.payable!.items
          : [],
      },
      receivable: {
        ...DEFAULT_DASHBOARD_DATA.transactions.receivable,
        ...(source.transactions?.receivable || {}),
        items: Array.isArray(source.transactions?.receivable?.items)
          ? source.transactions!.receivable!.items
          : [],
      },
    },
    recentBills: Array.isArray(source.recentBills) ? source.recentBills : [],
    recentMaintenance: Array.isArray(source.recentMaintenance) ? source.recentMaintenance : [],
    unpaidRent: {
      ...DEFAULT_DASHBOARD_DATA.unpaidRent,
      ...(source.unpaidRent || {}),
      aging: Array.isArray(source.unpaidRent?.aging) ? source.unpaidRent!.aging : [],
      tenants: Array.isArray(source.unpaidRent?.tenants) ? source.unpaidRent!.tenants : [],
      summary: {
        ...DEFAULT_DASHBOARD_DATA.unpaidRent.summary,
        ...(source.unpaidRent?.summary || {}),
      },
    },
    checkInCheckOut: {
      ...DEFAULT_DASHBOARD_DATA.checkInCheckOut,
      ...(source.checkInCheckOut || {}),
      checkIns: {
        ...DEFAULT_DASHBOARD_DATA.checkInCheckOut.checkIns,
        ...(source.checkInCheckOut?.checkIns || {}),
      },
      checkOuts: {
        ...DEFAULT_DASHBOARD_DATA.checkInCheckOut.checkOuts,
        ...(source.checkInCheckOut?.checkOuts || {}),
      },
    },
    meta: {
      ...DEFAULT_DASHBOARD_DATA.meta,
      ...(source.meta || {}),
    },
  };
};

/**
 * Professional overview dashboard page
 */
const Overview: React.FC = () => {
  const { currencySymbol } = useCurrency();
  const { user } = useAuth();
  
  // API Data State
  const [dashboardData, setDashboardData] = useState<OverviewDashboardResponse['data']>(DEFAULT_DASHBOARD_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unassigned Alerts State
  const [unassignedAlerts, setUnassignedAlerts] = useState<any[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(false);

  // Tab state for Paid Transactions & Recent Payments
  const [activePaymentTab, setActivePaymentTab] = useState<'transactions' | 'payments'>('transactions');
  
  // Tab state for Bills & Maintenance
  const [activeRequestTab, setActiveRequestTab] = useState<'bills' | 'maintenance'>('bills');

  // Fetch dashboard data based on user role
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only fetch if user is available
        if (!user) {
          setLoading(false);
          return;
        }
        
        let data: any;
        
        // Check if user is owner
        if (user.roleType === 'owner') {
          // Call owner-specific endpoint
          try {
            const response = await api.get('/owner/dashboard/overview');
            
            // Backend returns: { success: true, data: { hostels, tenants, bookings, payments, employees } }
            const ownerData = response.data?.data || response.data;
            
            if (!ownerData || !ownerData.hostels) {
              throw new Error('Invalid owner dashboard response');
            }
            
            // Transform owner data to match admin dashboard format
            data = {
              summaryCards: [
                {
                  key: 'activeTenants',
                  title: 'Active Tenants',
                  value: ownerData.tenants?.total || 0,
                  valueFormatted: (ownerData.tenants?.total || 0).toString(),
                  changePercent: 0,
                  changeFormatted: '0%',
                  direction: 'flat',
                  caption: 'Total tenants',
                },
                {
                  key: 'monthlyRevenue',
                  title: 'Monthly Revenue',
                  value: ownerData.payments?.totalCollected || 0,
                  valueFormatted: formatCurrency(ownerData.payments?.totalCollected || 0, currencySymbol),
                  changePercent: 0,
                  changeFormatted: '0%',
                  direction: 'flat',
                  caption: 'Collected this month',
                },
                {
                  key: 'activeVendors',
                  title: 'Employees',
                  value: ownerData.employees?.total || 0,
                  valueFormatted: (ownerData.employees?.total || 0).toString(),
                  changePercent: 0,
                  changeFormatted: '0%',
                  direction: 'flat',
                  caption: 'Active employees',
                },
                {
                  key: 'occupancyRate',
                  title: 'Occupancy Rate',
                  value: ownerData.hostels?.occupancyRate || 0,
                  valueFormatted: `${ownerData.hostels?.occupancyRate || 0}%`,
                  changePercent: 0,
                  changeFormatted: '0%',
                  direction: 'flat',
                  caption: 'Current occupancy',
                }
              ],
              profitLoss: { 
                series: [], 
                totalNetIncome: (ownerData.payments?.totalCollected || 0) - ((ownerData.payments?.totalAmount || 0) - (ownerData.payments?.totalCollected || 0))
              },
              transactions: {
                payable: { items: [] },
                receivable: { items: ownerData.payments?.list || [] }
              },
              activities: ownerData.bookings?.list || []
            };
          } catch (ownerError) {
            console.error('Error fetching owner dashboard:', ownerError);
            // Fall back to empty data
            data = {
              summaryCards: [],
              profitLoss: { series: [], totalNetIncome: 0 },
              transactions: { payable: { items: [] }, receivable: { items: [] } },
              activities: []
            };
          }
        } else if (user.roleType === 'admin') {
          // Admin uses original endpoint
          try {
            data = await getOverviewDashboard();
          } catch (adminError) {
            console.error('Error fetching admin dashboard:', adminError);
            // Fall back to empty data instead of crashing
            data = {
              summaryCards: [],
              profitLoss: { series: [], totalNetIncome: 0 },
              transactions: { payable: { items: [] }, receivable: { items: [] } },
              activities: []
            };
          }
        } else {
          // Other roles can use a simplified dashboard
          data = {
            summaryCards: [],
            profitLoss: { series: [], totalNetIncome: 0 },
            transactions: { payable: { items: [] }, receivable: { items: [] } },
            activities: []
          };
        }
        
        setDashboardData(normalizeDashboardData(data));
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        // Don't throw error - just set empty data and let user see the page
        setError(null); // Clear error to prevent logout
        setDashboardData(normalizeDashboardData(null));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Fetch unassigned alerts on component mount
  useEffect(() => {
    const fetchUnassignedAlerts = async () => {
      try {
        setLoadingAlerts(true);
        
        // Only fetch if user is available
        if (!user) {
          setLoadingAlerts(false);
          return;
        }
        
        if (user.roleType === 'owner') {
          // Fetch activity logs for owner
          try {
            const response = await api.get('/owner/dashboard/activity-log');
            // Backend returns: { success: true, data: [...activity logs] }
            const activityLogs = response.data?.data || response.data || [];
            setUnassignedAlerts(Array.isArray(activityLogs) ? activityLogs : []);
          } catch (err: any) {
            console.error('Error fetching owner activity logs:', err);
            setUnassignedAlerts([]);
          }
        } else if (user.roleType === 'admin') {
          // Fetch alerts for admin
          try {
            const response = await getUnassignedAlertsAPI({ limit: 10, status: 'open' });
            setUnassignedAlerts(response.data?.alerts || []);
          } catch (err: any) {
            console.error('Error fetching alerts:', err);
            setUnassignedAlerts([]);
          }
        } else {
          setUnassignedAlerts([]);
        }
      } catch (err: any) {
        console.error('Error fetching alerts/activity:', err);
        setUnassignedAlerts([]);
      } finally {
        setLoadingAlerts(false);
      }
    };

    fetchUnassignedAlerts();
  }, [user]);

  // Get stats from API data
  const stats = useMemo(() => {
    if (!dashboardData) {
      return {
        activeTenants: 0,
        monthlyRevenue: 0,
        activeVendors: 0,
        occupancyRate: 0,
      };
    }

    const occupancyCard = dashboardData.summaryCards.find(card => card.key === 'occupancyRate');
    const revenueCard = dashboardData.summaryCards.find(card => card.key === 'monthlyRevenue');
    const tenantsCard = dashboardData.summaryCards.find(card => card.key === 'activeTenants');
    const vendorsCard = dashboardData.summaryCards.find(card => card.key === 'activeVendors');

    return {
      activeTenants: tenantsCard?.value || 0,
      monthlyRevenue: revenueCard?.value || 0,
      activeVendors: vendorsCard?.value || 0,
      occupancyRate: occupancyCard?.value || 0,
    };
  }, [dashboardData]);

  // Get Profit & Loss data from API
  const profitLossData = useMemo(() => {
    if (!dashboardData || !dashboardData.profitLoss) return [];
    return dashboardData.profitLoss.series || [];
  }, [dashboardData]);

  // Get Net Income from API
  const netIncome = useMemo(() => {
    if (!dashboardData || !dashboardData.profitLoss) return 0;
    return dashboardData.profitLoss.totalNetIncome || 0;
  }, [dashboardData]);

  // Get paid transactions from API
  const paidTransactions = useMemo(() => {
    if (!dashboardData || !dashboardData.transactions?.payable?.items) return [];
    return (dashboardData.transactions.payable.items || []).map(transaction => {
        const daysAgo = Math.floor((Date.now() - new Date(transaction.date).getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...transaction,
          daysAgo,
        };
      });
  }, [dashboardData]);

  // Get recent payments received from API
  const recentPaymentsReceived = useMemo(() => {
    if (!dashboardData || !dashboardData.transactions?.receivable?.items) return [];
    return (dashboardData.transactions.receivable.items || []).map(payment => {
        const daysAgo = Math.floor((Date.now() - new Date(payment.date).getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...payment,
          daysAgo,
        };
      });
  }, [dashboardData]);

  // Get employee activity log from API
  const activityLog = useMemo(() => {
    if (!dashboardData) return [];
    // Handle both admin format (employeeActivityLog) and owner format (activities)
    const items = dashboardData.employeeActivityLog?.items || dashboardData.activities || [];
    return (items || []).map((activity: any) => {
        const timestamp = activity.timestamp || activity.createdAt;
        const hoursAgo = Math.floor((Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60));
        const daysAgo = Math.floor(hoursAgo / 24);
        return {
          ...activity,
          hoursAgo,
          daysAgo,
        };
      });
  }, [dashboardData]);

  // Format activity time
  const formatActivityTime = (hoursAgo: number, daysAgo: number) => {
    if (hoursAgo < 1) return 'Just now';
    if (hoursAgo < 24) return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    if (daysAgo === 1) return '1 day ago';
    return `${daysAgo} days ago`;
  };

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes('Payment')) return CurrencyDollarIcon;
    if (action.includes('Tenant')) return UsersIcon;
    if (action.includes('Alert')) return BellAlertIcon;
    if (action.includes('Request')) return ClipboardDocumentListIcon;
    if (action.includes('Vendor')) return UserGroupIcon;
    if (action.includes('Hostel')) return HomeIcon;
    return UserIcon;
  };

  // Get action color
  const getActionColor = (action: string) => {
    if (action.includes('Payment')) return 'bg-green-100 text-green-700';
    if (action.includes('Created')) return 'bg-blue-100 text-blue-700';
    if (action.includes('Updated')) return 'bg-yellow-100 text-yellow-700';
    if (action.includes('Resolved') || action.includes('Completed')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Get recent bills from API
  const recentBills = useMemo(() => {
    if (!dashboardData || !dashboardData.recentBills) return [];
    return (dashboardData.recentBills || []).map(bill => {
        const daysAgo = Math.floor((Date.now() - new Date(bill.date).getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...bill,
          daysAgo,
          property: bill.hostelName || 'N/A',
          unit: bill.tenantName || 'N/A',
        };
      });
  }, [dashboardData]);

  // Get recent maintenance from API
  const recentMaintenance = useMemo(() => {
    if (!dashboardData || !dashboardData.recentMaintenance) return [];
    return (dashboardData.recentMaintenance || []).map(req => {
        const daysAgo = Math.floor((Date.now() - new Date(req.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...req,
          daysAgo,
        };
      });
  }, [dashboardData]);

  // Get unpaid rent data from API
  const unpaidRentData = useMemo(() => {
    if (!dashboardData || !dashboardData.unpaidRent) return [];
    return dashboardData.unpaidRent.aging || [];
  }, [dashboardData]);

  // Get tenants with unpaid rent from API
  const tenantsWithUnpaidRent = useMemo(() => {
    if (!dashboardData || !dashboardData.unpaidRent) return [];
    return dashboardData.unpaidRent.tenants || [];
  }, [dashboardData]);

  // Get tenant payment status summary from API
  const allTenantsWithPaymentStatus = useMemo(() => {
    if (!dashboardData || !dashboardData.unpaidRent || !dashboardData.unpaidRent.summary) return [];
    // Create a mock array for the summary display
    const paidCount = dashboardData.unpaidRent.summary?.paidCount || 0;
    const unpaidCount = dashboardData.unpaidRent.summary?.unpaidCount || 0;
    return Array(paidCount + unpaidCount).fill(null).map((_, i) => ({
      id: i + 1,
      hasUnpaidRent: i >= paidCount,
    }));
  }, [dashboardData]);

  // Get total unpaid rent from API
  const totalUnpaidRent = useMemo(() => {
    if (!dashboardData || !dashboardData.unpaidRent) return 0;
    return dashboardData.unpaidRent.totalAmount || 0;
  }, [dashboardData]);

  // Get check in/out data from API
  const checkInCheckOutData = useMemo(() => {
    if (!dashboardData || !dashboardData.checkInCheckOut) return [];
    const checkIns = dashboardData.checkInCheckOut.checkIns?.count || 0;
    const checkOuts = dashboardData.checkInCheckOut.checkOuts?.count || 0;
    const total = checkIns + checkOuts;
    const checkInPercentage = total > 0 ? Math.round((checkIns / total) * 100) : 0;
    const checkOutPercentage = total > 0 ? Math.round((checkOuts / total) * 100) : 0;

    return [
      {
        type: 'Check In',
        count: checkIns,
        percentage: checkInPercentage,
      },
      {
        type: 'Check Out',
        count: checkOuts,
        percentage: checkOutPercentage,
      },
    ];
  }, [dashboardData]);

  const checkInCheckOutTotal = useMemo(() => {
    if (!dashboardData) return 0;
    return dashboardData.checkInCheckOut.total;
  }, [dashboardData]);

  // Get occupancy data from API
  const occupancyData = useMemo(() => {
    if (!dashboardData) return [];
    const occupancy = dashboardData.overview.occupancy;
    return [
      { name: 'Occupied', value: occupancy.occupied, percent: occupancy.occupiedPercent },
      { name: 'Vacant', value: occupancy.vacant, percent: occupancy.vacantPercent },
    ];
  }, [dashboardData]);

  const COLORS = ['#3b82f6', '#ec4899'];

  // Format time ago
  const formatTimeAgo = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };


  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Not Started':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get severity badge color for alerts
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'DANGER':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'WARN':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'INFO':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
          <p className="text-slate-600 mt-1">Dashboard summary and key metrics</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
          <p className="text-slate-600 mt-1">Dashboard summary and key metrics</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-medium">Error loading dashboard</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Get summary cards from API
  const occupancyCard = dashboardData?.summaryCards.find(card => card.key === 'occupancyRate');
  const revenueCard = dashboardData?.summaryCards.find(card => card.key === 'monthlyRevenue');
  const tenantsCard = dashboardData?.summaryCards.find(card => card.key === 'activeTenants');
  const vendorsCard = dashboardData?.summaryCards.find(card => card.key === 'activeVendors');

  // Handle PDF export
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add branding (watermark, logo, center text, user name)
      const userName = user?.username || 'User';
      addPDFBranding(doc, userName);
      
      let yPos = 35; // Start after header
      
      // Title
      doc.setFontSize(18);
      doc.text('Overview Dashboard Report', 105, yPos, { align: 'center' });
      yPos += 10;
      
      // Date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
      yPos += 15;
      
      // Summary Cards
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Summary Statistics', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Occupancy Rate: ${occupancyCard?.valueFormatted || `${stats.occupancyRate}%`}`, 20, yPos);
      yPos += 6;
      doc.text(`Active Tenants: ${tenantsCard?.valueFormatted || stats.activeTenants.toString()}`, 20, yPos);
      yPos += 6;
      doc.text(`Monthly Revenue: ${revenueCard?.valueFormatted || formatCurrency(stats.monthlyRevenue, currencySymbol)}`, 20, yPos);
      yPos += 6;
      doc.text(`Active Vendors: ${vendorsCard?.valueFormatted || stats.activeVendors.toString()}`, 20, yPos);
      yPos += 10;
      
      // Net Income
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Financial Summary', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Net Income: ${formatCurrency(netIncome, currencySymbol)} (Last 3 months)`, 20, yPos);
      yPos += 10;
      
      // Transactions Summary
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Transactions Summary', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Payable Transactions: ${paidTransactions.length}`, 20, yPos);
      yPos += 6;
      doc.text(`Receivable Payments: ${recentPaymentsReceived.length}`, 20, yPos);
      yPos += 10;
      
      // Unpaid Rent
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Unpaid Rent Summary', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Total Unpaid Rent: ${formatCurrency(totalUnpaidRent, currencySymbol)}`, 20, yPos);
      yPos += 6;
      doc.text(`Tenants with Unpaid Rent: ${tenantsWithUnpaidRent.length}`, 20, yPos);
      yPos += 10;
      
      // Recent Bills & Maintenance
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Recent Requests', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Recent Bills: ${recentBills.length}`, 20, yPos);
      yPos += 6;
      doc.text(`Maintenance Requests: ${recentMaintenance.length}`, 20, yPos);
      yPos += 10;
      
      // Check In/Out
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Check In & Check Out', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Total: ${checkInCheckOutTotal.toLocaleString()} (Last 30 days / Next 30 days)`, 20, yPos);
      
      // Add header to all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        if (i > 1) {
          addPDFHeader(doc, userName);
        }
      }
      
      // Save PDF
      doc.save(`overview-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
          <p className="text-slate-600 mt-1">Dashboard summary and key metrics</p>
        </div>
        <Button
          variant="outline"
          icon={ArrowDownTrayIcon}
          onClick={handleExportPDF}
        >
          Export PDF
        </Button>
      </div>

      {/* Stats Cards and Activity Log in Same Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Row 1 - Card 1 */}
        <StatCard
          title={occupancyCard?.title || "Occupancy Rate"}
          value={occupancyCard?.valueFormatted || `${stats.occupancyRate}%`}
          icon={<HomeIcon className="w-6 h-6 text-white" />}
          variant="primary"
          trend={{
            value: occupancyCard?.changeFormatted || '+0%',
            isPositive: occupancyCard?.direction === 'up' || occupancyCard?.direction === 'flat'
          }}
          delay={0}
        />
        
        {/* Row 1 - Card 2 */}
        <StatCard
          title={tenantsCard?.title || "Active Tenants"}
          value={tenantsCard?.valueFormatted || stats.activeTenants.toString()}
          icon={<UsersIcon className="w-6 h-6 text-white" />}
          variant="success"
          trend={{
            value: tenantsCard?.changeFormatted || '+0%',
            isPositive: tenantsCard?.direction === 'up' || tenantsCard?.direction === 'flat'
          }}
          delay={0.1}
        />
        
        {/* Row 1 & 2 - Activity Log (spans 2 rows) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:row-span-2">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Employee Activity Log</h2>
            <p className="text-xs text-slate-600">Track all employee activities</p>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {activityLog.map((activity, idx) => {
              const ActionIcon = getActionIcon(activity.action);
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${getActionColor(activity.action)}`}>
                    <ActionIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <p className="font-semibold text-slate-900 text-xs">{activity.employeeName}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                        {activity.employeeRole}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-0.5 line-clamp-1">{activity.description}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 flex-wrap">
                      <span>{activity.hostelName}</span>
                      <span>•</span>
                      <span>{formatActivityTime(activity.hoursAgo, activity.daysAgo)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Row 2 - Card 3 */}
        <StatCard
          title={revenueCard?.title || "Monthly Revenue"}
          value={revenueCard?.valueFormatted || formatCurrency(stats.monthlyRevenue, currencySymbol)}
          icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />}
          variant="success"
          trend={{
            value: revenueCard?.changeFormatted || '+0%',
            isPositive: revenueCard?.direction === 'up' || revenueCard?.direction === 'flat'
          }}
          delay={0.2}
        />
        
        {/* Row 2 - Card 4 */}
        <StatCard
          title={vendorsCard?.title || "Active Vendors"}
          value={vendorsCard?.valueFormatted || stats.activeVendors.toString()}
          icon={<UserGroupIcon className="w-6 h-6 text-white" />}
          variant="default"
          trend={{
            value: vendorsCard?.changeFormatted || '+0%',
            isPositive: vendorsCard?.direction === 'up' || vendorsCard?.direction === 'flat'
          }}
          delay={0.3}
        />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit & Loss */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Profit & loss</h2>
            <p className="text-sm text-slate-600">
              Net Income: <span className="font-semibold text-slate-900">{formatCurrency(netIncome, currencySymbol)}</span> (Last 3 months to date)
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={profitLossData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
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
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              <Line 
                type="monotone" 
                dataKey="netIncome" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Net Income"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Paid Transactions & Recent Payments Received - Combined Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Transactions </h2>
            <p className="text-sm text-slate-600">All payable transactions and receivable payments</p>
          </div>
          
          {/* Tabs for Paid Transactions and Recent Payments */}
          <div className="mb-4">
            <div className="flex gap-2 border-b border-gray-200">
              <button 
                onClick={() => setActivePaymentTab('transactions')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activePaymentTab === 'transactions'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Payable Transactions ({paidTransactions.length})
              </button>
              <button 
                onClick={() => setActivePaymentTab('payments')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activePaymentTab === 'payments'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Receivable Payments ({recentPaymentsReceived.length})
              </button>
            </div>
          </div>

          {/* Paid Transactions Section */}
          {activePaymentTab === 'transactions' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {paidTransactions.slice(0, 5).map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'Rent' || transaction.type === 'Deposit' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {transaction.type === 'Rent' || transaction.type === 'Deposit' ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <CurrencyDollarIcon className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{transaction.tenantName || transaction.description || 'N/A'}</p>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                        {transaction.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {formatTimeAgo(transaction.daysAgo)} • {transaction.hostelName || 'N/A'} • {transaction.property || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'Rent' || transaction.type === 'Deposit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'Rent' || transaction.type === 'Deposit' ? '+' : '-'}
                      {formatCurrency(transaction.amount, currencySymbol)}
                    </p>
                    <p className="text-xs text-slate-500">{transaction.ref}</p>
                  </div>
                </motion.div>
              ))}
              {paidTransactions.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No paid transactions found.
                </div>
              )}
            </motion.div>
          )}

          {/* Recent Payments Received Section */}
          {activePaymentTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {recentPaymentsReceived.slice(0, 5).map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <HandRaisedIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{payment.tenantName}</p>
                    <p className="text-sm text-slate-600">
                      {formatTimeAgo(payment.daysAgo)} • {payment.hostelName || 'N/A'} • {payment.property}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      +{formatCurrency(payment.amount, currencySymbol)}
                    </p>
                    <p className="text-xs text-slate-500">{payment.ref}</p>
                  </div>
                </motion.div>
              ))}
              {recentPaymentsReceived.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No recent payments found.
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Recent Tenant Requests - Bills & Maintenance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Recent tenant requests</h2>
            <p className="text-sm text-slate-600">Bills and maintenance requests</p>
          </div>
          
          {/* Tabs for Bills and Maintenance */}
          <div className="mb-4">
            <div className="flex gap-2 border-b border-gray-200">
              <button 
                onClick={() => setActiveRequestTab('bills')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeRequestTab === 'bills'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Bills ({recentBills.length})
              </button>
              <button 
                onClick={() => setActiveRequestTab('maintenance')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeRequestTab === 'maintenance'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Maintenance ({recentMaintenance.length})
              </button>
            </div>
          </div>

          {/* Bills Tab Content */}
          {activeRequestTab === 'bills' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {recentBills.map((bill) => (
                <motion.div
                  key={bill.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <CurrencyDollarIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{bill.description}</p>
                    <p className="text-sm text-slate-600">
                      {formatTimeAgo(bill.daysAgo)} • {bill.property} • {bill.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(bill.amount, currencySymbol)}</p>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </div>
                </motion.div>
              ))}
              {recentBills.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No bills found.
                </div>
              )}
            </motion.div>
          )}

          {/* Maintenance Tab Content */}
          {activeRequestTab === 'maintenance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {recentMaintenance.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{request.description}</p>
                    <p className="text-sm text-slate-600">
                      {formatTimeAgo(request.daysAgo)} • {request.property} - {request.unit}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </motion.div>
              ))}
              {recentMaintenance.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No maintenance requests found.
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Unassigned Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BellAlertIcon className="w-6 h-6 text-red-600" />
              Unassigned Alerts
            </h2>
            <p className="text-sm text-slate-600">
              Total: <span className="font-semibold text-slate-900">{unassignedAlerts.length}</span> alerts pending assignment
            </p>
          </div>

          {loadingAlerts ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {unassignedAlerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    alert.severity === 'DANGER' ? 'bg-red-100' : 
                    alert.severity === 'WARN' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    <BellAlertIcon className={`w-5 h-5 ${
                      alert.severity === 'DANGER' ? 'text-red-600' : 
                      alert.severity === 'WARN' ? 'text-orange-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-slate-900 truncate">{alert.title}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border shrink-0 ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-1">{alert.description || 'No description'}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                        {alert.type}
                      </span>
                      {alert.hostel && (
                        <>
                          <span>•</span>
                          <span>{alert.hostel}</span>
                        </>
                      )}
                      {alert.room && (
                        <>
                          <span>•</span>
                          <span>Room {alert.room}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{alert.created}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border shrink-0 ${
                    alert.rawStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    alert.rawStatus === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {alert.rawStatus}
                  </span>
                </motion.div>
              ))}
              {unassignedAlerts.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <BellAlertIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>No unassigned alerts found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Unpaid Rent */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Unpaid rent</h2>
            <p className="text-sm text-slate-600">
              Total: <span className="font-semibold text-slate-900">{formatCurrency(totalUnpaidRent, currencySymbol)}</span>
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={unpaidRentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis dataKey="category" type="category" stroke="#64748b" style={{ fontSize: '12px' }} width={80} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value, currencySymbol)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="amount" fill="#ef4444" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {unpaidRentData.map((item) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.category} days</span>
                <span className="font-medium text-slate-900">{formatCurrency(item.amount, currencySymbol)}</span>
              </div>
            ))}
          </div>
          
          {/* Tenants with Unpaid Rent List */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Tenants with Unpaid Rent</h3>
            {tenantsWithUnpaidRent.length === 0 ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                No tenants with unpaid rent
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {tenantsWithUnpaidRent.map((tenant, index) => (
                  <motion.div
                    key={`${tenant.tenantName}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-900">{tenant.tenantName}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          tenant.status === 'Overdue' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {tenant.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          {tenant.category} days
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {tenant.room} • {tenant.hostelName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatCurrency(tenant.amount, currencySymbol)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* All Tenants Payment Status Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Tenant Payment Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium mb-1">Paid Rent</p>
                <p className="text-2xl font-bold text-green-900">
                  {allTenantsWithPaymentStatus.filter(t => !t.hasUnpaidRent).length}
                </p>
                <p className="text-xs text-green-600 mt-1">Tenants</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-red-600 font-medium mb-1">Unpaid Rent</p>
                <p className="text-2xl font-bold text-red-900">
                  {allTenantsWithPaymentStatus.filter(t => t.hasUnpaidRent).length}
                </p>
                <p className="text-xs text-red-600 mt-1">Tenants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Check In & Check Out */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Check In & Check Out</h2>
            <p className="text-sm text-slate-600">
              Total: <span className="font-semibold text-slate-900">{checkInCheckOutTotal.toLocaleString()}</span> (Last 30 days / Next 30 days)
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={checkInCheckOutData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                stroke="#64748b" 
                style={{ fontSize: '12px' }}
                domain={[0, 'dataMax']}
                allowDecimals={false}
              />
              <YAxis dataKey="type" type="category" stroke="#64748b" style={{ fontSize: '12px' }} width={100} />
              <Tooltip
                formatter={(value: number) => [Math.round(value), 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {checkInCheckOutData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {checkInCheckOutData.map((item) => (
              <div key={item.type} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.type}</span>
                <span className="font-medium text-slate-900">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Occupancy rate</h2>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {occupancyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value} (${props.payload.percent}%)`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">
                  {occupancyData.find(d => d.name === 'Occupied')?.percent}%
                </div>
                <div className="text-sm text-slate-600">Occupied</div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {occupancyData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: COLORS[item.name === 'Occupied' ? 0 : 1] }}
                  />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-medium text-slate-900">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;
