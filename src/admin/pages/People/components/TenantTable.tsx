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
  TrashIcon
} from '@heroicons/react/24/outline';

interface TenantTableProps {
  tenants: any[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

const TenantTable: React.FC<TenantTableProps> = ({
  tenants,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'tenant',
      label: 'Tenant',
      sortable: true,
      render: (row: any) => {
        const tenantName = row.firstName && row.lastName 
          ? `${row.firstName} ${row.lastName}`
          : row.name || 'N/A';
        
        return (
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 truncate">{tenantName}</span>
                <Badge
                  variant={
                    row.status === 'active' || row.status === 'Active'
                      ? 'success'
                      : row.status === 'pending' || row.status === 'Pending'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {row.status === 'active' || row.status === 'Active' ? 'Current' : row.status || 'N/A'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 truncate">{row.email || 'N/A'}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'roomAllocation',
      label: 'Room Allocation',
      sortable: true,
      render: (row: any) => {
        const hostelName = row.hostel || row.activeAllocation?.hostel?.name || 'N/A';
        const floorName = row.floor || row.activeAllocation?.floor?.floorName || row.activeAllocation?.floor?.name || 'N/A';
        const roomNumber = row.room || row.activeAllocation?.room?.roomNumber || row.activeAllocation?.room?.number || 'N/A';
        const bedNumber = row.bed || row.activeAllocation?.bed?.bedNumber || row.activeAllocation?.bed?.number || 'N/A';
        
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{hostelName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Floor: {floorName}</span>
              <span>•</span>
              <span>Room: {roomNumber}</span>
              <span>•</span>
              <span>Bed: {bedNumber}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (row: any) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
            {row.phone ? (
              <span className="text-sm text-gray-700">{row.phone}</span>
            ) : (
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Add Phone Number
              </button>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(row.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tenants}
      emptyMessage="No tenants found. Try adjusting your search or filters."
    />
  );
};

export default TenantTable;










