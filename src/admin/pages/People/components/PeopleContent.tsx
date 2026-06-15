/**
 * PeopleContent Component
 * Main content area that renders tables based on active section
 */

import React from 'react';
import TenantTable from './TenantTable';
import EmployeeTable from './EmployeeTable';
import ProspectTable from './ProspectTable';
import { PeopleLoadingState } from './PeopleLoadingState';
import { PeopleEmptyState } from './PeopleEmptyState';

type PeopleSection = 'Tenants' | 'Employees' | 'Vendors' | 'Prospects';

interface PeopleContentProps {
  activeSection: PeopleSection | null;
  selectedHostelId: string;
  // Data
  tenants: any[];
  employees: any[];
  prospects: any[];
  // Loading states
  tenantsLoading: boolean;
  employeesLoading: boolean;
  prospectsLoading: boolean;
  // Handlers
  onView: (id: number, type: 'Tenant' | 'Employee' | 'Prospect') => void;
  onEdit: (id: number, type: 'Tenant' | 'Employee' | 'Prospect') => void;
  onDelete: (id: number, type: 'Tenant' | 'Employee' | 'Prospect', name: string) => void;
  onTransfer: (id: number, type: 'Tenant' | 'Employee' | 'Prospect', currentStatus: string) => void;
  onAddClick: () => void;
  // Vendor wrapper
  vendorListWrapper?: React.ReactNode;
}

export const PeopleContent: React.FC<PeopleContentProps> = React.memo(({
  activeSection,
  selectedHostelId,
  tenants,
  employees,
  prospects,
  tenantsLoading,
  employeesLoading,
  prospectsLoading,
  onView,
  onEdit,
  onDelete,
  onTransfer,
  onAddClick,
  vendorListWrapper,
}) => {
  if (!activeSection) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Select a Section</h2>
          <p className="text-slate-600">Choose a section from the directory to get started.</p>
        </div>
      </div>
    );
  }

  // Vendors section
  if (activeSection === 'Vendors') {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[calc(100vh-300px)]">
          {vendorListWrapper}
        </div>
      </div>
    );
  }

  // Prospects section
  if (activeSection === 'Prospects') {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="glass rounded-2xl border border-white/20 shadow-xl p-6">
          {prospectsLoading ? (
            <PeopleLoadingState section="Prospects" />
          ) : prospects.length === 0 ? (
            <PeopleEmptyState section="Prospects" selectedHostelId="" onAddClick={onAddClick} />
          ) : (
            <ProspectTable
              prospects={prospects}
              onView={(id) => onView(id, 'Prospect')}
              onEdit={(id) => onEdit(id, 'Prospect')}
              onDelete={(id, name) => onDelete(id, 'Prospect', name)}
              onTransfer={(id, status) => onTransfer(id, 'Prospect', status)}
            />
          )}
        </div>
      </div>
    );
  }

  // Tenants and Employees sections
  if (!selectedHostelId) {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="glass rounded-2xl border border-white/20 shadow-xl p-6">
          <PeopleEmptyState section={activeSection} selectedHostelId={selectedHostelId} onAddClick={onAddClick} />
        </div>
      </div>
    );
  }

  if (activeSection === 'Tenants') {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="glass rounded-2xl border border-white/20 shadow-xl p-6">
          {tenantsLoading ? (
            <PeopleLoadingState section="Tenants" />
          ) : tenants.length === 0 ? (
            <PeopleEmptyState section="Tenants" selectedHostelId={selectedHostelId} onAddClick={onAddClick} />
          ) : (
            <TenantTable
              tenants={tenants}
              onView={(id) => onView(id, 'Tenant')}
              onEdit={(id) => onEdit(id, 'Tenant')}
              onDelete={(id, name) => onDelete(id, 'Tenant', name)}
              onTransfer={(id, status) => onTransfer(id, 'Tenant', status)}
            />
          )}
        </div>
      </div>
    );
  }

  if (activeSection === 'Employees') {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="glass rounded-2xl border border-white/20 shadow-xl p-6">
          {employeesLoading ? (
            <PeopleLoadingState section="Employees" />
          ) : employees.length === 0 ? (
            <PeopleEmptyState section="Employees" selectedHostelId={selectedHostelId} onAddClick={onAddClick} />
          ) : (
            <EmployeeTable
              employees={employees}
              onView={(id) => onView(id, 'Employee')}
              onEdit={(id) => onEdit(id, 'Employee')}
              onDelete={(id, name) => onDelete(id, 'Employee', name)}
              onTransfer={(id, status) => onTransfer(id, 'Employee', status)}
            />
          )}
        </div>
      </div>
    );
  }

  return null;
});

PeopleContent.displayName = 'PeopleContent';

