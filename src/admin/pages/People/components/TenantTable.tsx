/**
 * TenantTable Component
 * Table display for tenants list
 */

import React from 'react';
import { DataTable } from '../../../components/DataTable';
import { Badge } from '../../../components/Badge';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface TenantTableProps {
  tenants: any[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
  onTransfer: (id: number, currentStatus: string) => void;
}

const TenantTable: React.FC<TenantTableProps> = ({
  tenants,
  onView,
  onEdit,
  onDelete,
  onTransfer,
}) => {
  const columns = [
    {
      key: 'rowNumber',
      label: '#',
      render: (row: any) => <span className="text-sm text-slate-700">{row.rowNumber}</span>,
      width: '12',
    },
    {
      key: 'tenant',
      label: 'Full Name / Father Name / Email / Lease',
      sortable: true,
      render: (row: any) => {
        const tenantName = row.firstName && row.lastName
          ? `${row.firstName} ${row.lastName}`
          : row.name || 'N/A';
        const fatherName = row.fatherName || row.father_name || row.father || 'N/A';
        const email = row.email || 'N/A';
        const leaseStart = row.leaseStart || row.lease_start || row.leaseFrom || 'N/A';
        const leaseEnd = row.leaseEnd || row.lease_end || row.leaseTo || 'N/A';

        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{tenantName}</p>
                <p className="text-sm text-gray-600 truncate">Father: {fatherName}</p>
                <p className="text-sm text-gray-600 truncate">{email}</p>
              </div>
            </div>
            <div className="text-sm text-slate-700">
              <span className="font-medium">Lease:</span> {leaseStart} - {leaseEnd}
            </div>
          </div>
        );
      },
    },
    {
      key: 'roomAllocation',
      label: 'Allocation of Tenant',
      sortable: true,
      render: (row: any) => {
        const hostelName = row.hostel || row.activeAllocation?.hostel?.name || 'N/A';
        const floorName = row.floor || row.activeAllocation?.floor?.floorName || row.activeAllocation?.floor?.name || 'N/A';
        const roomNumber = row.room || row.activeAllocation?.room?.roomNumber || row.activeAllocation?.room?.number || 'N/A';
        const bedNumber = row.bed || row.activeAllocation?.bed?.bedNumber || row.activeAllocation?.bed?.number || 'N/A';

        return (
          <div className="space-y-1 text-sm text-slate-700">
            <div className="font-medium text-slate-900">{hostelName}</div>
            <div>Floor: {floorName}</div>
            <div>Room: {roomNumber}</div>
            <div>Bed: {bedNumber}</div>
          </div>
        );
      },
    },
    {
      key: 'financials',
      label: 'Rs Rent / Rs Security / Rs Late Fee / Date',
      render: (row: any) => {
        const rent = row.rent || row.rentAmount || row.monthlyRent || 'N/A';
        const security = row.security || row.securityAmount || row.deposit || 'N/A';
        const lateFee = row.lateFee || row.late_fee || row.penalty || 'N/A';
        const paymentDate = row.paymentDate || row.lastPaymentDate || row.paidAt || row.payment_date || 'N/A';

        return (
          <div className="space-y-1 text-sm text-slate-700">
            <div>Rent: <span className="font-medium">{rent}</span></div>
            <div>Security: <span className="font-medium">{security}</span></div>
            <div>Late Fee: <span className="font-medium">{lateFee}</span></div>
            <div>Date: <span className="font-medium">{paymentDate}</span></div>
          </div>
        );
      },
    },
    {
      key: 'contact',
      label: 'Contact Info / Personal / Emergency',
      render: (row: any) => (
        <div className="space-y-2 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{row.phone || 'No personal phone'}</span>
          </div>
          <div className="text-slate-600">
            Emergency: {row.emergencyContact || row.emergency_contact || row.emergencyPhone || row.emergency_phone || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration Till Date',
      render: (row: any) => {
        const leaseStart = new Date(row.leaseStart || row.lease_start || row.leaseFrom || row.lease_from || row.startDate || row.start_date || '');
        const now = new Date();
        let durationLabel = 'N/A';

        if (!Number.isNaN(leaseStart.getTime())) {
          const years = now.getFullYear() - leaseStart.getFullYear();
          const months = now.getMonth() - leaseStart.getMonth();
          const totalMonths = years * 12 + months;
          const yearsDisplay = Math.floor(totalMonths / 12);
          const monthsDisplay = totalMonths % 12;
          durationLabel = `${yearsDisplay}yr${yearsDisplay !== 1 ? 's' : ''} ${monthsDisplay}mo`;
        }

        return <span className="text-sm text-slate-700">{durationLabel}</span>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => {
        const isActive = String(row.status || '').toLowerCase() === 'active';
        const transferLabel = isActive ? 'Mark Left' : 'Restore';
        const transferTitle = isActive ? 'Mark tenant as left/Inactive' : 'Restore tenant to active';

        return (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onView(row.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm"
              title="View Details"
            >
              <EyeIcon className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => onEdit(row.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors font-medium text-sm"
              title="Edit Tenant"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onTransfer(row.id, row.status || '')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors font-medium text-sm"
              title={transferTitle}
            >
              <ArrowPathIcon className="w-4 h-4" />
              {transferLabel}
            </button>
            <button
              onClick={() => onDelete(row.id, row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Tenant')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
              title="Delete Tenant"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const activeTenants = tenants
    .filter((tenant) => String(tenant.status || '').toLowerCase() === 'active')
    .map((tenant, index) => ({ ...tenant, rowNumber: index + 1 }));

  const inactiveTenants = tenants
    .filter((tenant) => String(tenant.status || '').toLowerCase() !== 'active')
    .map((tenant, index) => ({ ...tenant, rowNumber: activeTenants.length + index + 1 }));

  const renderSection = (title: string, description: string, sectionData: any[]) => (
    <div>
      <div className="mb-4 rounded-2xl border-l-4 border-blue-500 bg-blue-50/70 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-wide text-blue-700 font-semibold">{title}</div>
            <div className="text-sm text-blue-600">{description}</div>
          </div>
          <div className="text-sm font-semibold text-slate-700">Total tenants: {sectionData.length}</div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={sectionData}
        emptyMessage={`No ${title.toLowerCase()} found.`}
      />
    </div>
  );

  return (
    <div className="space-y-10">
      {activeTenants.length > 0 && renderSection('Active Tenants', 'Tenants currently staying in the hostel.', activeTenants)}
      {inactiveTenants.length > 0 && (
        <div className="pt-6 border-t border-blue-200">
          {renderSection('Inactive / Left Tenants', 'Tenants who have left or are not currently active.', inactiveTenants)}
        </div>
      )}
      {activeTenants.length === 0 && inactiveTenants.length === 0 && (
        <DataTable
          columns={columns}
          data={tenants.map((tenant, index) => ({ ...tenant, rowNumber: index + 1 }))}
          emptyMessage="No tenants found. Try adjusting your search or filters."
        />
      )}
    </div>
  );
};

export default TenantTable;










