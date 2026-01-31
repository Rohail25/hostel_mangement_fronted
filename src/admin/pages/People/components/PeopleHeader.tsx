/**
 * PeopleHeader Component
 * Header section with title, description, filters, and action buttons
 */

import React from 'react';
import { Select } from '../../../components/Select';
import { Button } from '../../../components/Button';
import { UserPlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

type PeopleSection = 'Tenants' | 'Employees' | 'Vendors' | 'Prospects';

interface PeopleHeaderProps {
  activeSection: PeopleSection | null;
  selectedHostelId: string;
  onHostelChange: (id: string) => void;
  hostelOptions: Array<{ value: string; label: string }>;
  hostelsLoading: boolean;
  onExportPDF: () => void;
  onAddClick: () => void;
}

export const PeopleHeader: React.FC<PeopleHeaderProps> = React.memo(({
  activeSection,
  selectedHostelId,
  onHostelChange,
  hostelOptions,
  hostelsLoading,
  onExportPDF,
  onAddClick,
}) => {
  if (!activeSection) return null;

  const getTitle = () => {
    return activeSection === 'Vendors' ? 'Vendor' : activeSection;
  };

  const getDescription = () => {
    switch (activeSection) {
      case 'Tenants':
        return 'Manage tenant information and room allocations.';
      case 'Employees':
        return 'Manage employee information and roles.';
      case 'Vendors':
        return 'View and manage all vendors.';
      case 'Prospects':
        return 'Manage potential tenants and applications.';
      default:
        return '';
    }
  };

  const getAddButtonLabel = () => {
    switch (activeSection) {
      case 'Tenants':
        return 'Add Tenant';
      case 'Employees':
        return 'Add Employee';
      case 'Prospects':
        return 'Add Prospect';
      case 'Vendors':
        return 'Add Vendor';
      default:
        return 'Add';
    }
  };

  const handleVendorAdd = () => {
    window.dispatchEvent(new CustomEvent('openAddVendorModal'));
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap p-6 pb-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{getTitle()}</h1>
        <p className="text-slate-600 mt-1">{getDescription()}</p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {activeSection !== 'Prospects' && (
          <div className="w-full sm:w-80">
            <div className="relative">
              <Select
                value={selectedHostelId}
                onChange={onHostelChange}
                options={hostelOptions}
                disabled={hostelsLoading}
              />
              <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-blue-500 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          onClick={onExportPDF}
          icon={ArrowDownTrayIcon}
        >
          Export PDF
        </Button>
        {(activeSection === 'Tenants' || activeSection === 'Employees' || activeSection === 'Prospects') && (
          <Button
            variant="primary"
            onClick={onAddClick}
            icon={UserPlusIcon}
          >
            {getAddButtonLabel()}
          </Button>
        )}
        {activeSection === 'Vendors' && (
          <Button
            variant="primary"
            onClick={handleVendorAdd}
            icon={UserPlusIcon}
          >
            {getAddButtonLabel()}
          </Button>
        )}
      </div>
    </div>
  );
});

PeopleHeader.displayName = 'PeopleHeader';

