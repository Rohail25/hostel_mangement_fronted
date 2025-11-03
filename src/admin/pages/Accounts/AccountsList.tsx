/**
 * AccountsList page
 * Financial transactions and account management
 */

import React, { useState, useMemo } from 'react';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';
import type { Transaction } from '../../types/accounts';
import { formatDate, formatCurrency } from '../../types/common';
import accountsData from '../../mock/accounts.json';

/**
 * Accounts list page
 */
const AccountsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter data
  const filteredData = useMemo(() => {
    let data = accountsData as Transaction[];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (t) =>
          t.ref.toLowerCase().includes(query) ||
          t.tenantName?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter) {
      data = data.filter((t) => t.type === typeFilter);
    }

    // Status filter
    if (statusFilter) {
      data = data.filter((t) => t.status === statusFilter);
    }

    return data;
  }, [searchQuery, typeFilter, statusFilter]);

  // Calculate summary
  const summary = useMemo(() => {
    const income = filteredData
      .filter((t) => t.type === 'Rent' || t.type === 'Deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredData
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const refunds = filteredData
      .filter((t) => t.type === 'Refund')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses: expenses + refunds,
      net: income - expenses - refunds,
    };
  }, [filteredData]);

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
      label: 'Tenant/Description',
      render: (row) => row.tenantName || row.description || '-',
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <span
          className={
            row.type === 'Expense' || row.type === 'Refund'
              ? 'text-red-600'
              : 'text-green-600'
          }
        >
          {row.type === 'Expense' || row.type === 'Refund' ? '-' : '+'}
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
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
      ),
    },
  ];

  // Toolbar with search and filters
  const toolbar = (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by reference or tenant..."
        />
      </div>
      <div className="w-full sm:w-40">
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: '', label: 'All Types' },
            { value: 'Rent', label: 'Rent' },
            { value: 'Deposit', label: 'Deposit' },
            { value: 'Expense', label: 'Expense' },
            { value: 'Refund', label: 'Refund' },
          ]}
        />
      </div>
      <div className="w-full sm:w-40">
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
        <p className="text-slate-600 mt-1">Financial transactions and records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
          <p className="text-sm font-medium text-green-700 mb-1">
            Total Income
          </p>
          <p className="text-3xl font-bold text-green-900">
            {formatCurrency(summary.income)}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
          <p className="text-sm font-medium text-red-700 mb-1">
            Total Expenses
          </p>
          <p className="text-3xl font-bold text-red-900">
            {formatCurrency(summary.expenses)}
          </p>
        </div>
        <div className="bg-brand-50 border border-brand-200 p-6 rounded-2xl">
          <p className="text-sm font-medium text-brand-700 mb-1">Net Balance</p>
          <p className="text-3xl font-bold text-brand-900">
            {formatCurrency(summary.net)}
          </p>
        </div>
      </div>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={filteredData}
        toolbar={toolbar}
        emptyMessage="No transactions found. Try adjusting your search or filters."
      />
    </div>
  );
};

export default AccountsList;

