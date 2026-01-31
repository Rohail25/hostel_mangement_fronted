/**
 * AccountsList page
 * Financial transactions and account management with Payable/Receivable tabs
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ROUTES from '../../routes/routePaths';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import type { Transaction } from '../../types/accounts';
import { formatDate, formatCurrency } from '../../types/common';

// Helper function to format date as MM/DD/YYYY for display
const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};
import accountsData from '../../mock/accounts.json';
import vendorsData from '../../mock/vendors.json';
import * as hostelService from '../../services/hostel.service';
import { api } from '../../../services/apiClient';
import { API_ROUTES } from '../../../services/api.config';
import {
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BanknotesIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';

type MainTab = 'Payable' | 'Receivable' | 'All';
type PayableSubTab = 'All' | 'Bills' | 'Vendor' | 'Laundry';
type ReceivableSubTab = 'All' | 'Received';
type ReceivableCategory = 'Rent' | 'Deposit';

/**
 * Accounts list page with Payable/Receivable tabs
 */
const AccountsList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active sections from route
  const getActiveMainTab = (): MainTab => {
    // Check if we're on the base /accounts route (All view)
    if (location.pathname === ROUTES.ACCOUNTS || location.pathname === ROUTES.ACCOUNTS + '/') {
      return 'All';
    }
    if (location.pathname.includes('/accounts/receivable')) return 'Receivable';
    if (location.pathname.includes('/accounts/payable')) return 'Payable';
    return 'All'; // Default to All
  };
  
  const getActivePayableTab = (): PayableSubTab => {
    if (location.pathname.includes('/accounts/payable/bills')) return 'Bills';
    if (location.pathname.includes('/accounts/payable/vendor')) return 'Vendor';
    if (location.pathname.includes('/accounts/payable/laundry')) return 'Laundry';
    if (location.pathname.includes('/accounts/payable/all')) return 'All';
    if (location.pathname === ROUTES.ACCOUNTS_PAYABLE) return 'All'; // Default to All when just /payable
    return 'All'; // Default
  };
  
  const getActiveReceivableTab = (): ReceivableSubTab => {
    if (location.pathname.includes('/accounts/receivable/received')) return 'Received';
    return 'All'; // Default
  };
  
  const activeMainTab = getActiveMainTab();
  const activePayableTab = getActivePayableTab();
  const activeReceivableTab = getActiveReceivableTab();
  
  // Redirect to /accounts/payable/all if just /accounts/payable (but keep /accounts as "All" view)
  useEffect(() => {
    if (location.pathname === ROUTES.ACCOUNTS_PAYABLE) {
      navigate(ROUTES.ACCOUNTS_PAYABLE_BILLS, { replace: true }); // Redirect to first sub-item
    }
  }, [location.pathname, navigate]);
  const [activeReceivableCategory, setActiveReceivableCategory] = useState<ReceivableCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [hostelFilter, setHostelFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  
  // Report Period filters
  const [reportPeriod, setReportPeriod] = useState<string>('Last 7 days');
  const [dateFrom, setDateFrom] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [groupBy, setGroupBy] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [hostels, setHostels] = useState<Array<{ id: string | number; name: string; city: string }>>([]);
  const [hostelsLoading, setHostelsLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBill, setEditingBill] = useState<Transaction | null>(null);
  const [editStatusForm, setEditStatusForm] = useState<{ status: Transaction['status'] }>({
    status: 'Pending',
  });
  const [editBillForm, setEditBillForm] = useState({
    title: '',
    category: '',
    amount: '',
    date: '',
    hostelId: '',
  });
  // Store manually added payable entries with their category
  const [manuallyAddedPayables, setManuallyAddedPayables] = useState<(Transaction & { payableCategory?: PayableSubTab })[]>([]);
  // Real data from API
  const [apiPayables, setApiPayables] = useState<Transaction[]>([]);
  const [apiReceivables, setApiReceivables] = useState<Transaction[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [payableForm, setPayableForm] = useState({
    category: '' as PayableSubTab | '',
    vendorId: '',
    hostelId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending' as Transaction['status'],
  });
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error' | 'warning' | 'info'; message: string }>({
    open: false,
    type: 'success',
    message: '',
  });

  // Reset vendor filter when switching away from Vendor tab
  useEffect(() => {
    if (activeMainTab !== 'Payable' || activePayableTab !== 'Vendor') {
      setVendorFilter('');
    }
  }, [activeMainTab, activePayableTab]);

  // Reset type filter when switching tabs
  useEffect(() => {
    if (activeMainTab === 'All') {
      setTypeFilter('All');
    } else if (activeMainTab === 'Payable') {
      setTypeFilter('All');
    } else if (activeMainTab === 'Receivable') {
      setTypeFilter('All');
    }
  }, [activeMainTab]);

  // Base filtered data by hostel (applies to ALL calculations)
  // Includes both original accounts data and manually added payables
  const baseFilteredData = useMemo(() => {
    let data = [...(accountsData as Transaction[])];
    
    // Add manually added payables to the data
    data = [...data, ...manuallyAddedPayables];
    
    // Apply hostel filter first - this affects ALL data on the page
    if (hostelFilter) {
      data = data.filter((t) => String(t.hostelId) === hostelFilter);
    }
    
    return data;
  }, [hostelFilter, manuallyAddedPayables]);

  // Calculate summary - Income, Expense, Profit, Bad Debt (based on hostel filter)
  const summary = useMemo(() => {
    const income = baseFilteredData
      .filter((t) => (t.type === 'Rent' || t.type === 'Deposit') && t.status === 'Paid')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = baseFilteredData
      .filter((t) => t.type === 'Expense' && t.status === 'Paid')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = income - expenses;
    
    // Bad debt = Overdue payments that are unlikely to be collected
    const badDebt = baseFilteredData
      .filter((t) => t.status === 'Overdue' && (t.type === 'Rent' || t.type === 'Deposit'))
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      profit,
      badDebt,
      isProfit: profit >= 0,
    };
  }, [baseFilteredData]);

  // Filter data based on active tabs (uses baseFilteredData which already has hostel filter)
  const filteredData = useMemo(() => {
    let data = [...baseFilteredData]; // Start with hostel-filtered data

    // Handle "All" view - show both Payable and Receivable
    if (activeMainTab === 'All') {
      // Show all transactions (both Expense and Rent/Deposit) - no type filtering
      // Apply Type filter if selected
      if (typeFilter && typeFilter !== 'All') {
        if (typeFilter === 'Expense') {
          data = data.filter((t) => t.type === 'Expense');
        } else if (typeFilter === 'Income') {
          data = data.filter((t) => t.type === 'Rent' || t.type === 'Deposit');
        }
      }
    } else if (activeMainTab === 'Payable') {
      // Payable = Expenses, Bills, Vendor payments, Laundry
      data = data.filter((t) => t.type === 'Expense');
      
      // Further filter by payable sub-tab
      if (activePayableTab === 'All') {
        // "All" tab: Show all Expense transactions (no further filtering)
        // Don't apply any additional filters, just show all expenses
      } else if (activePayableTab === 'Bills') {
        data = data.filter((t) => {
          // Check if transaction has a stored category (manually added)
          const transactionWithCategory = t as Transaction & { payableCategory?: PayableSubTab };
          if (transactionWithCategory.payableCategory) {
            return transactionWithCategory.payableCategory === 'Bills';
          }
          // Otherwise, filter by description keywords (existing data)
          return (
            t.description?.toLowerCase().includes('bill') ||
            t.description?.toLowerCase().includes('utility') ||
            t.description?.toLowerCase().includes('internet')
          );
        });
      } else if (activePayableTab === 'Vendor') {
        data = data.filter((t) => {
          // Check if transaction has a stored category (manually added)
          const transactionWithCategory = t as Transaction & { payableCategory?: PayableSubTab };
          if (transactionWithCategory.payableCategory) {
            return transactionWithCategory.payableCategory === 'Vendor';
          }
          // Otherwise, filter by description keywords (existing data)
          return (
            t.description?.toLowerCase().includes('vendor') ||
            t.description?.toLowerCase().includes('supplier')
          );
        });
        
        // Apply vendor filter if selected
        if (vendorFilter) {
          const selectedVendor = (vendorsData as any[]).find((v) => String(v.id) === vendorFilter);
          if (selectedVendor) {
            // Filter by vendor name in description
            const vendorNameLower = selectedVendor.name.toLowerCase();
            data = data.filter((t) => 
              t.description?.toLowerCase().includes(vendorNameLower) ||
              t.description?.toLowerCase().includes(selectedVendor.specialty.toLowerCase())
            );
          }
        }
      } else if (activePayableTab === 'Laundry') {
        data = data.filter((t) => {
          // Check if transaction has a stored category (manually added)
          const transactionWithCategory = t as Transaction & { payableCategory?: PayableSubTab };
          if (transactionWithCategory.payableCategory) {
            return transactionWithCategory.payableCategory === 'Laundry';
          }
          // Otherwise, filter by description keywords (existing data)
          return (
            t.description?.toLowerCase().includes('laundry') ||
            t.description?.toLowerCase().includes('cleaning')
          );
        });
      }
    } else {
      // Receivable = Rent, Deposits
      data = data.filter((t) => 
        t.type === 'Rent' || t.type === 'Deposit'
      );
      
      // Filter by receivable sub-tab
      if (activeReceivableTab === 'Received') {
        // Show only paid/received entries
        data = data.filter((t) => t.status === 'Paid');
      } else if (activeReceivableTab === 'All') {
        // "All" tab: Show Pending and Overdue only (EXCLUDE Paid status)
        data = data.filter((t) => t.status === 'Pending' || t.status === 'Overdue');
      }
      
      // Filter by category if selected
      if (activeReceivableCategory) {
        if (activeReceivableCategory === 'Rent') {
          data = data.filter((t) => t.type === 'Rent');
        } else if (activeReceivableCategory === 'Deposit') {
          data = data.filter((t) => t.type === 'Deposit');
        }
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (t) =>
          t.ref.toLowerCase().includes(query) ||
          t.tenantName?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    // Status filter - Apply normally for all tabs
    // Note: "All" tab already filters to show only Pending and Overdue (excludes Paid)
    if (statusFilter) {
      data = data.filter((t) => t.status === statusFilter);
    }

    // Date range filter
    if (dateFrom && dateTo) {
      data = data.filter((t) => {
        const transactionDate = new Date(t.date);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // Include the entire end date
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    // Type filter (Expense/Income/All) - Only apply if not already filtered by tab
    // This filter is mainly useful for the "All" view
    if (activeMainTab === 'All' && typeFilter && typeFilter !== 'All') {
      if (typeFilter === 'Expense') {
        data = data.filter((t) => t.type === 'Expense');
      } else if (typeFilter === 'Income') {
        data = data.filter((t) => t.type === 'Rent' || t.type === 'Deposit');
      } else if (typeFilter === 'Rent') {
        data = data.filter((t) => t.type === 'Rent');
      } else if (typeFilter === 'Deposit') {
        data = data.filter((t) => t.type === 'Deposit');
      }
    }

    // Note: Hostel filter is already applied in baseFilteredData
    // Note: Group by functionality can be implemented for displaying grouped data later

    return data;
  }, [activeMainTab, activePayableTab, activeReceivableTab, activeReceivableCategory, searchQuery, statusFilter, vendorFilter, dateFrom, dateTo, typeFilter, baseFilteredData]);

  // Define columns
  const columns: Column<Transaction>[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (row) => formatDate(row.date),
    },
    {
      key: 'ref',
      label: 'Reference',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge
          variant={
            row.type === 'Rent' || row.type === 'Deposit'
              ? 'success'
              : row.type === 'Expense'
              ? 'warning'
              : 'info'
          }
        >
          {row.type}
        </Badge>
      ),
    },
    {
      key: 'tenantName',
      label: activeMainTab === 'Payable' ? 'Description' : 'Tenant',
      render: (row) => row.tenantName || row.description || '-',
    },
    {
      key: 'hostelName',
      label: 'Hostel',
      render: (row) => (
        <span className="text-slate-700 font-medium">
          {row.hostelName || '-'}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <span
          className={
            activeMainTab === 'Payable' || row.type === 'Expense'
              ? 'text-red-600 font-semibold'
              : 'text-green-600 font-semibold'
          }
        >
          {activeMainTab === 'Payable' || row.type === 'Expense' ? '-' : '+'}
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        // For Bills in Payable section, show dropdown instead of badge
        if (activeMainTab === 'Payable' && activePayableTab === 'Bills') {
          return (
            <Select
              value={row.status}
              onChange={async (value) => {
                try {
                  // Extract expense ID
                  let expenseId = row.id;
                  if (row.ref && row.ref.startsWith('EXP-')) {
                    expenseId = parseInt(row.ref.replace('EXP-', ''), 10);
                  }
                  
                  // Update status via API
                  const response = await api.put(API_ROUTES.EXPENSE.UPDATE_STATUS(expenseId), {
                    status: value,
                  });
                  if (response.success) {
                    setToast({
                      open: true,
                      type: 'success',
                      message: 'Status updated successfully',
                    });
                    // Update local state
                    setManuallyAddedPayables((prev) =>
                      prev.map((p) => (p.id === row.id ? { ...p, status: value as Transaction['status'] } : p))
                    );
                    // You may need to refetch data from API here
                  }
                } catch (error: any) {
                  setToast({
                    open: true,
                    type: 'error',
                    message: error.message || 'Failed to update status',
                  });
                }
              }}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Overdue', label: 'Overdue' },
              ]}
            />
          );
        }
        // For other cases, show badge
        return (
          <Badge
            variant={
              row.status === 'Paid'
                ? 'success'
                : row.status === 'Overdue'
                ? 'danger'
                : 'warning'
            }
          >
            {row.status}
          </Badge>
        );
      },
    },
  ];

  // Add actions column for Bills in Payable section
  const payableBillsColumns: Column<Transaction>[] = [
    ...columns,
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingBill(row);
              // Extract expense ID
              let expenseId = row.id;
              if (row.ref && row.ref.startsWith('EXP-')) {
                expenseId = parseInt(row.ref.replace('EXP-', ''), 10);
              }
              // Fetch bill details and populate edit form
              setEditBillForm({
                title: row.description || '',
                category: 'bill',
                amount: String(row.amount),
                date: row.date,
                hostelId: String(row.hostelId || ''),
              });
              setIsEditModalOpen(true);
            }}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={async () => {
              if (window.confirm(`Are you sure you want to delete this bill?`)) {
                try {
                  // Extract expense ID from reference (EXP-0001 -> 1) or use row.id
                  let expenseId = row.id;
                  if (row.ref && row.ref.startsWith('EXP-')) {
                    expenseId = parseInt(row.ref.replace('EXP-', ''), 10);
                  }
                  
                  const response = await api.delete(API_ROUTES.EXPENSE.DELETE(expenseId));
                  if (response.success) {
                    setToast({
                      open: true,
                      type: 'success',
                      message: 'Bill deleted successfully',
                    });
                    // Remove from manually added payables if it exists there
                    setManuallyAddedPayables((prev) => prev.filter((p) => p.id !== row.id));
                    // Refresh data - you may need to refetch here
                  }
                } catch (error: any) {
                  setToast({
                    open: true,
                    type: 'error',
                    message: error.message || 'Failed to delete bill',
                  });
                }
              }
            }}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Add actions column for Receivable
  const receivableColumns: Column<Transaction>[] = [
    ...columns,
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => {
            setEditingTransaction(row);
            setEditStatusForm({ status: row.status });
            setIsEditStatusModalOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
          Edit Status
        </button>
      ),
    },
  ];

  // Calculate payable and receivable totals
  const payableTotal = useMemo(() => {
    if (activeMainTab === 'Payable') {
      return filteredData.reduce((sum, t) => sum + t.amount, 0);
    }
    return 0;
  }, [activeMainTab, filteredData]);

  const receivableTotal = useMemo(() => {
    if (activeMainTab === 'Receivable') {
      return filteredData.reduce((sum, t) => sum + t.amount, 0);
    }
    return 0;
  }, [activeMainTab, filteredData]);

  // Tab counts (for reference, not used in UI anymore - navigation handled by second sidebar)
  const tabCounts = useMemo(() => ({
    Payable: baseFilteredData.filter((t) => t.type === 'Expense').length,
    Receivable: baseFilteredData.filter((t) => 
      (t.type === 'Rent' || t.type === 'Deposit') && 
      (t.status === 'Pending' || t.status === 'Overdue')
    ).length,
    Bills: baseFilteredData.filter((t) => t.type === 'Expense' && (t.status === 'Pending' || t.status === 'Overdue')).length,
    Vendor: baseFilteredData.filter((t) => t.type === 'Expense' && t.ref?.includes('VENDOR')).length,
    Laundry: baseFilteredData.filter((t) => t.type === 'Expense' && t.ref?.includes('LAUNDRY')).length,
    All: baseFilteredData.filter((t) => t.type === 'Rent' && (t.status === 'Pending' || t.status === 'Overdue')).length,
    Received: baseFilteredData.filter((t) => t.type === 'Rent' && t.status === 'Paid').length,
  }), [baseFilteredData]);

  // Receivable category options
  const receivableCategoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Rent', label: 'Rent' },
    { value: 'Deposit', label: 'Deposit' },
  ];

  // Fetch hostels from API on component mount
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setHostelsLoading(true);
        const hostelsData = await hostelService.getAllHostelsFromAPI();
        // Map hostels to match the expected format
        setHostels(hostelsData.map(h => ({
          id: h.id,
          name: h.name,
          city: h.city || '',
        })));
      } catch (err: any) {
        console.error('Error fetching hostels:', err);
        setHostels([]);
      } finally {
        setHostelsLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Prepare hostel options for dropdown
  const hostelOptions = useMemo(() => {
    if (hostelsLoading) {
      return [{ value: '', label: 'Loading hostels...' }];
    }
    const options = [{ value: '', label: 'All Hostels' }];
    hostels.forEach((hostel) => {
      options.push({
        value: String(hostel.id),
        label: `${hostel.name} - ${hostel.city}`,
      });
    });
    return options;
  }, [hostels, hostelsLoading]);

  // Prepare vendor options for dropdown (only show when Vendor tab is active)
  const vendorOptions = useMemo(() => {
    const options = [{ value: '', label: 'All Vendors' }];
    const vendors = vendorsData as any[];
    vendors.forEach((vendor) => {
      options.push({
        value: String(vendor.id),
        label: `${vendor.name} (${vendor.specialty})`,
      });
    });
    return options;
  }, []);

  // Prepare vendor options for form (only active vendors)
  const formVendorOptions = useMemo(() => {
    const options = [{ value: '', label: 'Select Vendor' }];
    const vendors = vendorsData as any[];
    vendors
      .filter((v) => v.status === 'Active')
      .forEach((vendor) => {
        options.push({
          value: String(vendor.id),
          label: `${vendor.name} (${vendor.specialty})`,
        });
      });
    return options;
  }, []);

  // Category options for payable form
  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'Bills', label: 'Bills' },
    { value: 'Vendor', label: 'Vendor' },
    { value: 'Laundry', label: 'Laundry' },
  ];

  // Get selected hostel name for display
  const selectedHostelName = useMemo(() => {
    if (!hostelFilter) return null;
    const hostel = hostels.find((h) => String(h.id) === hostelFilter);
    return hostel?.name || null;
  }, [hostelFilter, hostels]);

  // Get selected vendor name for display
  const selectedVendorName = useMemo(() => {
    if (!vendorFilter) return null;
    const vendors = vendorsData as any[];
    const vendor = vendors.find((v) => String(v.id) === vendorFilter);
    return vendor ? `${vendor.name} (${vendor.specialty})` : null;
  }, [vendorFilter]);

  // Handle add payable form submission
  const handleAddPayable = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!payableForm.category) {
      setToast({
        open: true,
        type: 'warning',
        message: 'Please select a category',
      });
      return;
    }
    
    if (!payableForm.hostelId) {
      setToast({
        open: true,
        type: 'warning',
        message: 'Please select a hostel',
      });
      return;
    }
    
    if (!payableForm.amount || parseFloat(payableForm.amount) <= 0) {
      setToast({
        open: true,
        type: 'warning',
        message: 'Please enter a valid amount',
      });
      return;
    }
    
    if (!payableForm.description) {
      setToast({
        open: true,
        type: 'warning',
        message: 'Please enter a description',
      });
      return;
    }
    
    // If Vendor category is selected, vendor is required
    if (payableForm.category === 'Vendor' && !payableForm.vendorId) {
      setToast({
        open: true,
        type: 'warning',
        message: 'Please select a vendor',
      });
      return;
    }

    try {
      // For Bills category, create expense via API
      if (payableForm.category === 'Bills') {
        const response = await api.post(API_ROUTES.EXPENSE.CREATE, {
          title: payableForm.description,
          category: 'bill',
          amount: parseFloat(payableForm.amount),
          type: 'expense',
          date: payableForm.date,
          hostelId: payableForm.hostelId,
          status: payableForm.status,
        });

        if (response.success) {
          setToast({
            open: true,
            type: 'success',
            message: 'Bill created successfully!',
          });
          setIsAddModalOpen(false);
          setPayableForm({
            category: '' as PayableSubTab | '',
            vendorId: '',
            hostelId: '',
            amount: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
          });
          // Refresh data - you may need to refetch here
          return;
        }
      }

      // For other categories (Vendor, Laundry), create manually added entry
      // Generate reference number
      const refPrefix = payableForm.category === 'Bills' ? 'BILL' : 
                        payableForm.category === 'Vendor' ? 'VEND' : 'LAUN';
      const refNumber = `${refPrefix}-${Date.now()}`;
      
      // Get hostel name
      const selectedHostel = hostels.find((h) => String(h.id) === payableForm.hostelId);
      const hostelName = selectedHostel?.name || '';
      
      // Build description with vendor name if applicable
      let description = payableForm.description;
      if (payableForm.category === 'Vendor' && payableForm.vendorId) {
        const selectedVendor = (vendorsData as any[]).find((v) => String(v.id) === payableForm.vendorId);
        if (selectedVendor) {
          description = `${selectedVendor.name} - ${payableForm.description}`;
        }
      }
      
      // Create new transaction with category stored
      const newTransaction: Transaction & { payableCategory?: PayableSubTab } = {
        id: Date.now(), // In real app, this would come from backend
        date: payableForm.date,
        ref: refNumber,
        type: 'Expense',
        amount: parseFloat(payableForm.amount),
        status: payableForm.status,
        description: description,
        hostelId: Number(payableForm.hostelId),
        hostelName: hostelName,
        payableCategory: payableForm.category, // Store the category for filtering
      };
      
      // Add to manually added payables
      setManuallyAddedPayables((prev) => [...prev, newTransaction]);
      
      setToast({
        open: true,
        type: 'success',
        message: `${payableForm.category} payable entry added successfully! It will appear in the ${payableForm.category} tab.`,
      });
      
      // Reset form
      setPayableForm({
        category: '' as PayableSubTab | '',
        vendorId: '',
        hostelId: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      });
      
      setIsAddModalOpen(false);
    } catch (error: any) {
      console.error('Error creating payable:', error);
      setToast({
        open: true,
        type: 'error',
        message: error.message || 'Failed to create payable entry',
      });
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setPayableForm({
      category: '' as PayableSubTab | '',
      vendorId: '',
      hostelId: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    });
  };

  // Handle PDF export
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      
      doc.setFontSize(18);
      doc.text(`${activeMainTab} Accounts Report`, 105, yPos, { align: 'center' });
      yPos += 10;
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
      yPos += 15;
      
      if (filteredData.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`${activeMainTab} Transactions`, 20, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        filteredData.slice(0, 30).forEach((transaction, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${transaction.description || 'N/A'} - ${formatCurrency(transaction.amount)} - ${transaction.status}`, 20, yPos);
          yPos += 6;
        });
        
        yPos += 5;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        if (activeMainTab === 'Payable') {
          doc.text(`Total Payable: ${formatCurrency(payableTotal)}`, 20, yPos);
        } else if (activeMainTab === 'Receivable') {
          doc.text(`Total Receivable: ${formatCurrency(receivableTotal)}`, 20, yPos);
        }
      } else {
        doc.setFontSize(12);
        doc.text('No transactions available', 20, yPos);
      }
      
      doc.save(`accounts-${activeMainTab.toLowerCase()}-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      setToast({
        open: true,
        type: 'error',
        message: 'Failed to export PDF. Please try again.',
      });
    }
  };

  // Handle edit status form submission
  const handleEditStatus = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTransaction) return;
    
    // In a real app, this would update the transaction via API
    console.log('Updating transaction status:', {
      id: editingTransaction.id,
      oldStatus: editingTransaction.status,
      newStatus: editStatusForm.status,
    });
    
    setToast({
      open: true,
      type: 'success',
      message: `Transaction status updated to ${editStatusForm.status} successfully!`,
    });
    
    setIsEditStatusModalOpen(false);
    setEditingTransaction(null);
    setEditStatusForm({ status: 'Pending' });
  };

  // Handle edit status modal close
  const handleEditStatusClose = () => {
    setIsEditStatusModalOpen(false);
    setEditingTransaction(null);
    setEditStatusForm({ status: 'Pending' });
  };

  // Toolbar with search and status filters only (hostel filter is at top)
  const toolbar = (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by reference, tenant, or description..."
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'Paid', label: 'Paid' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Overdue', label: 'Overdue' },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Hostel Filter */}
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-600 mt-1">Manage payables, receivables, and financial overview</p>
        </div>
        
        {/* Hostel Filter and Export Button - Right side of heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 sm:mt-0 mt-2"
        >
          <Button
            variant="outline"
            onClick={handleExportPDF}
            icon={ArrowDownTrayIcon}
          >
            Export PDF
          </Button>
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            Filter by Hostel:
          </label>
          <div className="w-64">
            <Select
              value={hostelFilter}
              onChange={setHostelFilter}
              options={hostelOptions}
              placeholder={hostelsLoading ? "Loading hostels..." : "Select Hostel"}
              disabled={hostelsLoading}
            />
          </div>
        </motion.div>
      </div>


      {/* Vendor Filter and Selected Badges - Below header */}
      {(activeMainTab === 'Payable' && activePayableTab === 'Vendor') || (selectedHostelName || selectedVendorName) ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border border-white/20 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Vendor Filter - Only show when Vendor tab is active */}
            {activeMainTab === 'Payable' && activePayableTab === 'Vendor' && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                  Filter by Vendor:
                </label>
                <div className="flex-1 sm:w-64">
                  <Select
                    value={vendorFilter}
                    onChange={setVendorFilter}
                    options={vendorOptions}
                    placeholder="Select Vendor"
                  />
                </div>
              </div>
            )}
            
            {(selectedHostelName || selectedVendorName) && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedHostelName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-100/50 rounded-lg border border-brand-200/50">
                    <span className="text-xs text-brand-700 font-medium">Hostel:</span>
                    <span className="text-sm text-brand-900 font-semibold">{selectedHostelName}</span>
                  </div>
                )}
                {selectedVendorName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100/50 rounded-lg border border-purple-200/50">
                    <span className="text-xs text-purple-700 font-medium">Vendor:</span>
                    <span className="text-sm text-purple-900 font-semibold">{selectedVendorName}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ) : null}

  

      {/* Summary Cards - Income, Expense, Profit, Bad Debt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Income Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass p-6 rounded-xl border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.income)}</p>
        </motion.div>

        {/* Expense Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-xl border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
              <ArrowTrendingDownIcon className="w-6 h-6 text-white" />
            </div>
            <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.expenses)}</p>
        </motion.div>

        {/* Profit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`glass p-6 rounded-xl border border-white/20 shadow-lg ${
            summary.isProfit ? 'bg-green-50/30' : 'bg-red-50/30'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              summary.isProfit 
                ? 'bg-gradient-to-br from-green-400 to-green-600' 
                : 'bg-gradient-to-br from-red-400 to-red-600'
            }`}>
              {summary.isProfit ? (
                <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
              ) : (
                <ArrowTrendingDownIcon className="w-6 h-6 text-white" />
              )}
            </div>
            <span className={`text-sm font-semibold ${summary.isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {summary.isProfit ? 'Gain' : 'Loss'}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Profit / Loss</p>
          <p className={`text-2xl font-bold ${summary.isProfit ? 'text-green-900' : 'text-red-900'}`}>
            {summary.isProfit ? '+' : ''}{formatCurrency(summary.profit)}
          </p>
        </motion.div>

        {/* Capital Invested Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-xl border border-white/20 shadow-lg bg-orange-50/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-orange-600">Loss</span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Capital Invested</p>
          <p className="text-2xl font-bold text-orange-900">{formatCurrency(summary.badDebt)}</p>
        </motion.div>
      </div>

        {/* Report Period Filter Section */}
        <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-4 border border-white/20 shadow-lg mb-6"
      >
        <div className="space-y-4">
          {/* Report Period Heading */}
          <h3 className="text-sm font-bold text-slate-900">Report Period</h3>
          
          {/* Filter Controls Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by - Only for Payable */}
            {activeMainTab === 'Payable' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Filter by:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(ROUTES.ACCOUNTS_PAYABLE_BILLS)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activePayableTab === 'Bills'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    Bills
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.ACCOUNTS_PAYABLE_VENDOR)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activePayableTab === 'Vendor'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    Vendor
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.ACCOUNTS_PAYABLE_LAUNDRY)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activePayableTab === 'Laundry'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    Laundry
                  </button>
                </div>
              </div>
            )}

            {/* Category Filter - Only for Receivable */}
            {activeMainTab === 'Receivable' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Category:</label>
                <Select
                  value={activeReceivableCategory}
                  onChange={(value) => setActiveReceivableCategory(value as ReceivableCategory | '')}
                  options={receivableCategoryOptions}
                />
              </div>
            )}

            {/* Period Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Period:</label>
              <Select
                value={reportPeriod}
                onChange={(value) => {
                  setReportPeriod(value);
                  const today = new Date();
                  const todayStr = today.toISOString().split('T')[0];
                  
                  if (value === 'Today') {
                    setDateFrom(todayStr);
                    setDateTo(todayStr);
                  } else if (value === 'Last 7 days') {
                    const last7Days = new Date(today);
                    last7Days.setDate(last7Days.getDate() - 7);
                    setDateFrom(last7Days.toISOString().split('T')[0]);
                    setDateTo(todayStr);
                  } else if (value === 'Last 30 days') {
                    const last30Days = new Date(today);
                    last30Days.setDate(last30Days.getDate() - 30);
                    setDateFrom(last30Days.toISOString().split('T')[0]);
                    setDateTo(todayStr);
                  } else if (value === 'This Month') {
                    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                    setDateFrom(firstDay.toISOString().split('T')[0]);
                    setDateTo(todayStr);
                  } else if (value === 'This Year') {
                    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
                    setDateFrom(firstDayOfYear.toISOString().split('T')[0]);
                    setDateTo(todayStr);
                  } else if (value === 'Custom Range') {
                    // Keep current dates for custom range
                  }
                }}
                options={[
                  { value: 'Today', label: 'Today' },
                  { value: 'Last 7 days', label: 'Last 7 days' },
                  { value: 'Last 30 days', label: 'Last 30 days' },
                  { value: 'This Month', label: 'This Month' },
                  { value: 'This Year', label: 'This Year' },
                  { value: 'Custom Range', label: 'Custom Range' },
                ]}
              />
            </div>
            
            {/* From Date Input */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">From:</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setReportPeriod('Custom Range');
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            {/* To Date Input */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">To:</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setReportPeriod('Custom Range');
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Group by Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Group by:</label>
              <Select
                value={groupBy}
                onChange={setGroupBy}
                options={[
                  { value: '', label: 'Group by' },
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                  { value: 'year', label: 'Year' },
                  { value: 'hostel', label: 'Hostel' },
                  { value: 'type', label: 'Type' },
                ]}
              />
            </div>
            
            {/* Type Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Type:</label>
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={
                  activeMainTab === 'All'
                    ? [
                        { value: 'All', label: 'All' },
                        { value: 'Expense', label: 'Expense' },
                        { value: 'Income', label: 'Income' },
                      ]
                    : activeMainTab === 'Payable'
                    ? [
                        { value: 'Expense', label: 'Expense' },
                        { value: 'All', label: 'All' },
                      ]
                    : [
                        { value: 'Income', label: 'Income' },
                        { value: 'Rent', label: 'Rent' },
                        { value: 'Deposit', label: 'Deposit' },
                        { value: 'All', label: 'All' },
                      ]
                }
              />
            </div>
            
            {/* Settings Button */}
            <button
              onClick={() => {
                // Settings functionality can be added later
                setToast({
                  open: true,
                  type: 'info',
                  message: 'Settings panel coming soon',
                });
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
              title="Settings"
            >
              <Cog6ToothIcon className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          {/* Selected Report Period Display */}
          <div className="mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors text-sm font-medium text-slate-700"
            >
              Report Period: {formatDateDisplay(dateFrom)} - {formatDateDisplay(dateTo)}
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Content - No tabs, navigation handled by second sidebar */}
      <div className="glass rounded-2xl border border-white/20 shadow-xl">
        <div className="p-6">
          {/* Summary for current tab */}
          <div className="mb-6 p-4 bg-white/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {activeMainTab === 'All'
                    ? 'All Accounts'
                    : activeMainTab === 'Payable' 
                    ? `Total Payable - ${activePayableTab}` 
                    : 'Total Receivable'}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {activeMainTab === 'All'
                    ? formatCurrency(payableTotal + receivableTotal)
                    : formatCurrency(activeMainTab === 'Payable' ? payableTotal : receivableTotal)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={activeMainTab === 'Payable' ? 'warning' : activeMainTab === 'Receivable' ? 'info' : 'default'}>
                  {filteredData.length} {activeMainTab === 'All' ? 'Transactions' : activeMainTab === 'Payable' ? 'Bills' : 'Invoices'}
                </Badge>
                {/* Add Button - Show different text based on active tab */}
                {activeMainTab === 'Payable' && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      // Pre-select the category based on active tab
                      setPayableForm((prev) => ({
                        ...prev,
                        category: activePayableTab as PayableSubTab,
                      }));
                      setIsAddModalOpen(true);
                    }}
                    icon={PlusIcon}
                  >
                    {activePayableTab === 'Vendor' 
                      ? 'Add Vendor' 
                      : activePayableTab === 'Bills'
                      ? 'Add Bill'
                      : activePayableTab === 'Laundry'
                      ? 'Add Laundry'
                      : 'Add Payable'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Data table */}
          <DataTable
            columns={
              activeMainTab === 'Receivable' 
                ? receivableColumns 
                : activeMainTab === 'Payable' && activePayableTab === 'Bills'
                ? payableBillsColumns
                : columns
            }
            data={filteredData}
            toolbar={toolbar}
            emptyMessage={`No ${activeMainTab === 'All' ? 'accounts' : activeMainTab === 'Payable' ? activePayableTab.toLowerCase() : 'receivable'} records found. Try adjusting your search or filters.`}
          />
        </div>
      </div>

      {/* Add Payable Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        title="Add New Payable Entry"
        size="lg"
      >
        <form onSubmit={handleAddPayable} className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={payableForm.category}
              onChange={(value) => {
                setPayableForm({ ...payableForm, category: value as PayableSubTab, vendorId: value !== 'Vendor' ? '' : payableForm.vendorId });
              }}
              options={categoryOptions}
            />
          </div>

          {/* Vendor Selection - Only show when Vendor category is selected */}
          {payableForm.category === 'Vendor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor <span className="text-red-500">*</span>
              </label>
              <Select
                value={payableForm.vendorId}
                onChange={(value) => setPayableForm({ ...payableForm, vendorId: value })}
                options={formVendorOptions}
              />
            </div>
          )}

          {/* Hostel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hostel <span className="text-red-500">*</span>
            </label>
            <Select
              value={payableForm.hostelId}
              onChange={(value) => setPayableForm({ ...payableForm, hostelId: value })}
              options={hostelOptions.filter((opt) => opt.value !== '')} // Remove "All Hostels" option
              disabled={hostelsLoading}
              placeholder={hostelsLoading ? "Loading hostels..." : "Select Hostel"}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={payableForm.amount}
              onChange={(e) => setPayableForm({ ...payableForm, amount: e.target.value })}
              placeholder="0.00"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={payableForm.description}
              onChange={(e) => setPayableForm({ ...payableForm, description: e.target.value })}
              placeholder="Enter description..."
              rows={3}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
              required
            />
          </div>

          {/* Date and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={payableForm.date}
                onChange={(e) => setPayableForm({ ...payableForm, date: e.target.value })}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <Select
                value={payableForm.status}
                onChange={(value) => setPayableForm({ ...payableForm, status: value as Transaction['status'] })}
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Paid', label: 'Paid' },
                  { value: 'Overdue', label: 'Overdue' },
                ]}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Add Payable Entry
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Bill Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBill(null);
          setEditBillForm({
            title: '',
            category: '',
            amount: '',
            date: '',
            hostelId: '',
          });
        }}
        title="Edit Bill"
        size="lg"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!editingBill) return;

            try {
              // Extract expense ID
              let expenseId = editingBill.id;
              if (editingBill.ref && editingBill.ref.startsWith('EXP-')) {
                expenseId = parseInt(editingBill.ref.replace('EXP-', ''), 10);
              }

              const response = await api.put(API_ROUTES.EXPENSE.UPDATE(expenseId), {
                title: editBillForm.title,
                category: editBillForm.category,
                amount: parseFloat(editBillForm.amount),
                date: editBillForm.date,
                hostelId: editBillForm.hostelId || null,
              });

              if (response.success) {
                setToast({
                  open: true,
                  type: 'success',
                  message: 'Bill updated successfully',
                });
                setIsEditModalOpen(false);
                setEditingBill(null);
                // Refresh data - you may need to refetch here
              }
            } catch (error: any) {
              setToast({
                open: true,
                type: 'error',
                message: error.message || 'Failed to update bill',
              });
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title/Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editBillForm.title}
              onChange={(e) => setEditBillForm({ ...editBillForm, title: e.target.value })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editBillForm.amount}
              onChange={(e) => setEditBillForm({ ...editBillForm, amount: e.target.value })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={editBillForm.date}
              onChange={(e) => setEditBillForm({ ...editBillForm, date: e.target.value })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2176FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hostel
            </label>
            <Select
              value={editBillForm.hostelId}
              onChange={(value) => setEditBillForm({ ...editBillForm, hostelId: value })}
              options={hostelOptions.filter((opt) => opt.value !== '')}
              disabled={hostelsLoading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingBill(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Bill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        isOpen={isEditStatusModalOpen}
        onClose={handleEditStatusClose}
        title="Edit Transaction Status"
        size="md"
      >
        <form onSubmit={handleEditStatus} className="space-y-4">
          {editingTransaction && (
            <>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium text-gray-900">{editingTransaction.ref}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">{editingTransaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(editingTransaction.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Status:</span>
                    <Badge
                      variant={
                        editingTransaction.status === 'Paid'
                          ? 'success'
                          : editingTransaction.status === 'Overdue'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {editingTransaction.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={editStatusForm.status}
                  onChange={(value) => setEditStatusForm({ status: value as Transaction['status'] })}
                  options={[
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Paid', label: 'Paid' },
                    { value: 'Overdue', label: 'Overdue' },
                  ]}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleEditStatusClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Update Status
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default AccountsList;

