/**
 * ProspectTable Component
 * Table display for prospects list
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
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ProspectTableProps {
  prospects: any[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
  onTransfer: (id: number, currentStatus: string) => void;
}

const ProspectTable: React.FC<ProspectTableProps> = ({
  prospects,
  onView,
  onEdit,
  onDelete,
  onTransfer,
}) => {
  const columns = [
    {
      key: 'prospect',
      label: 'Prospect',
      sortable: true,
      render: (row: any) => {
        const prospectName = row.firstName && row.lastName 
          ? `${row.firstName} ${row.lastName}`
          : row.name || 'N/A';
        const profession = row.profession || row.occupation || 'Not specified';
        
        return (
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 truncate">{prospectName}</span>
                <Badge
                  variant={
                    row.status === 'active' || row.status === 'Active'
                      ? 'success'
                      : row.status === 'inactive' || row.status === 'Inactive'
                      ? 'danger'
                      : row.status === 'pending' || row.status === 'Pending'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {row.status === 'active' || row.status === 'Active'
                    ? 'Active'
                    : row.status === 'inactive' || row.status === 'Inactive'
                    ? 'Inactive'
                    : row.status || 'Pending'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 truncate">{profession}</p>
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
            <EnvelopeIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700">{row.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
            {row.phone ? (
              <span className="text-sm text-gray-700">{row.phone}</span>
            ) : (
              <span className="text-sm text-gray-400">N/A</span>
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
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit(row.id)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onTransfer(row.id, row.status || '')}
            className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
            title={String(row.status || '').toLowerCase() === 'active' ? 'Mark Inactive' : 'Restore Active'}
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(row.id, row.name || `${row.firstName} ${row.lastName}`)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const activeProspects = prospects
    .filter((prospect) => String(prospect.status || '').toLowerCase() === 'active')
    .map((prospect, index) => ({ ...prospect, rowNumber: index + 1 }));

  const inactiveProspects = prospects
    .filter((prospect) => String(prospect.status || '').toLowerCase() === 'inactive')
    .map((prospect, index) => ({ ...prospect, rowNumber: activeProspects.length + index + 1 }));

  const renderSection = (title: string, description: string, sectionData: any[]) => (
    <div>
      <div className="mb-4 rounded-2xl border-l-4 border-blue-500 bg-blue-50/70 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-wide text-blue-700 font-semibold">{title}</div>
            <div className="text-sm text-blue-600">{description}</div>
          </div>
          <div className="text-sm font-semibold text-slate-700">Total prospects: {sectionData.length}</div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={sectionData}
        emptyMessage={`No ${title.toLowerCase()} prospects found.`}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {renderSection('Active', 'Currently active prospects', activeProspects)}
      {inactiveProspects.length > 0 && renderSection('Inactive', 'Prospects marked inactive', inactiveProspects)}
    </div>
  );
};

export default ProspectTable;

