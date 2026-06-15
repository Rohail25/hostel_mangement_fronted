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
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface EmployeeTableProps {
  employees: any[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
  onTransfer: (id: number, currentStatus: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onView,
  onEdit,
  onDelete,
  onTransfer,
}) => {
  const formatDate = (value: string | null | undefined) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-GB');
  };

  const getExpiryInfo = (terminationDate: string | null | undefined) => {
    if (!terminationDate) {
      return { label: 'N/A', isExpired: false };
    }

    const endDate = new Date(terminationDate);
    if (Number.isNaN(endDate.getTime())) {
      return { label: 'N/A', isExpired: false };
    }

    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { label: 'Expired', isExpired: true };
    }

    return { label: `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`, isExpired: true };
  };

  const columns = [

    {
      key: 'rowNumber',
      label: '#',
      render: (row: any) => <span className="text-sm text-slate-700">{row.rowNumber}</span>,
      width: '12',
    },
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
      render: (row: any) => {
        const isActive = String(row.status || '').toLowerCase() === 'active';
        const transferLabel = isActive ? 'Mark Left' : 'Restore';
        const transferTitle = isActive ? 'Mark employee as left/inactive' : 'Restore employee to active';

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
              title="Edit Employee"
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
              onClick={() => onDelete(row.id, row.name || row.fullName || 'Employee')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
              title="Delete Employee"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const activeEmployees = employees
    .filter((employee) => String(employee.status || '').toLowerCase() === 'active')
    .map((employee, index) => ({ ...employee, rowNumber: index + 1 }));

  const inactiveEmployees = employees
    .filter((employee) => String(employee.status || '').toLowerCase() !== 'active')
    .map((employee, index) => ({ ...employee, rowNumber: activeEmployees.length + index + 1 }));

  const renderSection = (title: string, description: string, sectionData: any[]) => (
    <div>
      <div className="mb-4 rounded-2xl border-l-4 border-blue-500 bg-blue-50/70 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-wide text-blue-700 font-semibold">{title}</div>
            <div className="text-sm text-blue-600">{description}</div>
          </div>
          <div className="text-sm font-semibold text-slate-700">Total employees: {sectionData.length}</div>
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
      {activeEmployees.length > 0 && renderSection('Active Employees', 'Employees currently working and active.', activeEmployees)}
      {inactiveEmployees.length > 0 && (
        <div className="pt-6 border-t border-blue-200">
          {renderSection('Inactive / Left Employees', 'Employees who are inactive or have left the hostel.', inactiveEmployees)}
        </div>
      )}
      {activeEmployees.length === 0 && inactiveEmployees.length === 0 && (
        <DataTable
          columns={columns}
          data={employees.map((employee, index) => ({ ...employee, rowNumber: index + 1 }))}
          emptyMessage="No employees found. Try adjusting your search or filters."
        />
      )}
    </div>
  );
};

export default EmployeeTable;










