/**
 * AlertsList page
 * View and manage system alerts
 */

import React, { useState, useMemo } from 'react';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';
import type { Alert } from '../../types/comms';
import { formatDate } from '../../types/common';
import alertsData from '../../mock/alerts.json';

/**
 * Alerts list page
 */
const AlertsList: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter data
  const filteredData = useMemo(() => {
    let data = alertsData as Alert[];

    if (severityFilter) {
      data = data.filter((a) => a.severity === severityFilter);
    }

    if (statusFilter) {
      data = data.filter((a) => a.status === statusFilter);
    }

    return data;
  }, [severityFilter, statusFilter]);

  // Define columns
  const columns: Column<Alert>[] = [
    {
      key: 'severity',
      label: 'Severity',
      render: (row) => (
        <Badge
          variant={
            row.severity === 'danger'
              ? 'danger'
              : row.severity === 'warn'
              ? 'warning'
              : 'info'
          }
        >
          {row.severity.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => row.description || '-',
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (row) => row.assignedTo || 'Unassigned',
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'open' ? 'warning' : 'success'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  // Toolbar
  const toolbar = (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-48">
        <Select
          value={severityFilter}
          onChange={setSeverityFilter}
          options={[
            { value: '', label: 'All Severities' },
            { value: 'info', label: 'Info' },
            { value: 'warn', label: 'Warning' },
            { value: 'danger', label: 'Danger' },
          ]}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'open', label: 'Open' },
            { value: 'closed', label: 'Closed' },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Alerts</h1>
        <p className="text-slate-600 mt-1">System alerts and notifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
          <p className="text-sm font-medium text-red-700 mb-1">Danger</p>
          <p className="text-3xl font-bold text-red-900">
            {alertsData.filter((a) => a.severity === 'danger').length}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
          <p className="text-sm font-medium text-amber-700 mb-1">Warning</p>
          <p className="text-3xl font-bold text-amber-900">
            {alertsData.filter((a) => a.severity === 'warn').length}
          </p>
        </div>
        <div className="bg-brand-50 border border-brand-200 p-6 rounded-2xl">
          <p className="text-sm font-medium text-brand-700 mb-1">Info</p>
          <p className="text-3xl font-bold text-brand-900">
            {alertsData.filter((a) => a.severity === 'info').length}
          </p>
        </div>
      </div>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={filteredData}
        toolbar={toolbar}
        emptyMessage="No alerts found."
      />
    </div>
  );
};

export default AlertsList;

