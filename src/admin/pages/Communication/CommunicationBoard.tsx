/**
 * CommunicationBoard page
 * Communication management with tab-based filtering - Shows biodata/profiles
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BriefcaseIcon,
  HomeIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Tabs } from '../../components/Tabs';
import type { Tab } from '../../components/Tabs';
import { Badge } from '../../components/Badge';
import tenantsData from '../../mock/tenants.json';
import employeesData from '../../mock/employees.json';
import vendorsData from '../../mock/vendors.json';
import { formatDate } from '../../types/common';

type ActiveTab = 'Tenants' | 'Employees' | 'Vendors';

/**
 * Communication board page - Shows all biodata
 */
const CommunicationBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('Tenants');

  // Define tabs with counts
  const tabs: Tab[] = [
    {
      id: 'Tenants',
      label: 'Tenants',
      count: tenantsData.length,
    },
    {
      id: 'Employees',
      label: 'Employees',
      count: employeesData.length,
    },
    {
      id: 'Vendors',
      label: 'Vendors',
      count: vendorsData.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Communication Directory</h1>
        <p className="text-slate-600 mt-1">
          View biodata and contact information for tenants, employees, and vendors
        </p>
      </div>

      {/* Tabs */}
      <div className="glass rounded-2xl border border-white/20 shadow-xl">
        <div className="px-6 pt-4">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as ActiveTab)}
          />
        </div>

        {/* Biodata Cards */}
        <div className="p-6">
          {/* Tenants */}
          {activeTab === 'Tenants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenantsData.map((tenant, idx) => (
                <motion.div
                  key={tenant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {tenant.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{tenant.name}</h3>
                      <Badge variant={tenant.status === 'Active' ? 'success' : 'default'}>
                        {tenant.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">{tenant.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <PhoneIcon className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">{tenant.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <HomeIcon className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium">
                        Room {tenant.room}-{tenant.bed}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CalendarIcon className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">
                        {formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Employees */}
          {activeTab === 'Employees' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employeesData.map((employee, idx) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {employee.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{employee.name}</h3>
                      <Badge variant={employee.status === 'Active' ? 'success' : 'default'}>
                        {employee.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <BriefcaseIcon className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-semibold">{employee.role}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <EnvelopeIcon className="w-5 h-5 text-green-500" />
                      <span className="text-sm">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <PhoneIcon className="w-5 h-5 text-green-500" />
                      <span className="text-sm">{employee.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CalendarIcon className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Joined: {formatDate(employee.joinedAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Vendors */}
          {activeTab === 'Vendors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorsData.map((vendor, idx) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {vendor.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{vendor.name}</h3>
                      <Badge variant={vendor.status === 'Active' ? 'success' : 'default'}>
                        {vendor.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <BriefcaseIcon className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-semibold">{vendor.specialty}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <PhoneIcon className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">{vendor.phone}</span>
                    </div>
                    {vendor.email && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <EnvelopeIcon className="w-5 h-5 text-purple-500" />
                        <span className="text-sm">{vendor.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-600">
                      <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{vendor.rating}/5 Rating</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CalendarIcon className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">Last Invoice: {formatDate(vendor.lastInvoice)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="glass p-6 rounded-2xl border border-white/20 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Directory Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <UserCircleIcon className="w-6 h-6 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Total Tenants</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{tenantsData.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <BriefcaseIcon className="w-6 h-6 text-green-600" />
              <p className="text-sm font-medium text-green-900">Total Employees</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{employeesData.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <UserCircleIcon className="w-6 h-6 text-purple-600" />
              <p className="text-sm font-medium text-purple-900">Total Vendors</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">{vendorsData.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationBoard;

