/**
 * EmployeeTable Component
 * Table display for employees list
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

interface EmployeeTableProps {
  employees: any[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      sortable: true,
      render: (row: any) => {
        const employeeName = row.name || 'N/A';
        const role = row.role || row.roleName || 'N/A';
        
        return (
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 truncate">{employeeName}</span>
                <Badge
                  variant={
                    row.status === 'active' || row.status === 'Active'
                      ? 'success'
                      : row.status === 'inactive' || row.status === 'Inactive'
                      ? 'default'
                      : 'warning'
                  }
                >
                  {row.status === 'active' || row.status === 'Active' ? 'Current' : row.status || 'N/A'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 truncate">{role}</p>
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
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Add Phone Number
              </button>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'workingTime',
      label: 'Working Time (Date)',
      sortable: true,
      render: (row: any) => {
        const joinDate = row.joinDate ? new Date(row.joinDate).toLocaleDateString() : 'N/A';
        return (
          <div className="text-sm text-gray-700">
            {joinDate}
          </div>
        );
      },
    },
    {
      key: 'workingHours',
      label: 'Working Hours',
      render: (row: any) => {
        let hoursDisplay = 'N/A';
        if (row.workingHours) {
          if (typeof row.workingHours === 'string') {
            hoursDisplay = row.workingHours;
          } else if (typeof row.workingHours === 'object' && row.workingHours.startTime && row.workingHours.endTime) {
            hoursDisplay = `${row.workingHours.startTime} - ${row.workingHours.endTime}`;
          }
        }
        return (
          <div className="text-sm text-gray-700">
            {hoursDisplay}
          </div>
        );
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
      data={employees}
      emptyMessage="No employees found. Try adjusting your search or filters."
    />
  );
};

export default EmployeeTable;










