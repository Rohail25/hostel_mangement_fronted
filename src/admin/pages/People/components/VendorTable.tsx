/**
 * VendorTable Component
 * Table display for vendors list (similar to TenantTable)
 */

import React from 'react';
import { DataTable } from '../../../components/DataTable';
import { Badge } from '../../../components/Badge';
import { 
  BuildingStorefrontIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface VendorTableProps {
  vendors: any[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

const VendorTable: React.FC<VendorTableProps> = ({
  vendors,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'vendor',
      label: 'Vendor',
      sortable: true,
      render: (row: any) => {
        const vendorName = row.name || 'N/A';
        const companyName = row.companyName || '';
        
        return (
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{vendorName.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 truncate">{vendorName}</span>
                <Badge
                  variant={
                    row.status === 'active' || row.status === 'Active' || row.statusLabel === 'Active'
                      ? 'success'
                      : row.status === 'pending' || row.status === 'Pending' || row.statusLabel === 'Pending'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {row.statusLabel || row.status || 'N/A'}
                </Badge>
              </div>
              {companyName && (
                <p className="text-sm text-gray-600 truncate">{companyName}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'specialty',
      label: 'Specialty',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <WrenchScrewdriverIcon className="w-4 h-4 text-purple-500 shrink-0" />
          <span className="text-sm text-gray-700">{row.specialty || row.primaryService || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (row: any) => (
        <div className="space-y-2">
          {row.contact?.phone && (
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700">{row.contact.phone}</span>
            </div>
          )}
          {row.contact?.email && (
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 truncate">{row.contact.email}</span>
            </div>
          )}
          {!row.contact?.phone && !row.contact?.email && (
            <span className="text-sm text-gray-400">No contact info</span>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (row: any) => {
        if (row.rating?.average) {
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-purple-600">{row.rating.display || `${row.rating.average}/5`}</span>
              {row.rating.totalReviews > 0 && (
                <span className="text-xs text-gray-400">({row.rating.totalReviews} reviews)</span>
              )}
            </div>
          );
        }
        return <span className="text-sm text-gray-400">N/A</span>;
      },
    },
    {
      key: 'services',
      label: 'Services',
      render: (row: any) => {
        if (row.serviceTags && row.serviceTags.length > 0) {
          return (
            <div className="flex gap-1 flex-wrap">
              {row.serviceTags.slice(0, 3).map((tag: string, tagIdx: number) => (
                <span key={tagIdx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {row.serviceTags.length > 3 && (
                <span className="text-xs text-gray-400">+{row.serviceTags.length - 3} more</span>
              )}
            </div>
          );
        }
        return <span className="text-sm text-gray-400">N/A</span>;
      },
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
      data={vendors}
      emptyMessage="No vendors found. Try adjusting your search or filters."
    />
  );
};

export default VendorTable;





