/**
 * ViewModal Component
 * Modal for viewing tenant/employee/owner details
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../../../../services/api.config';
import ScoreCardView from './ScoreCardView';

interface ModalData {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
  profilePhoto?: string;
  [key: string]: any;
}

interface ViewModalProps {
  modal: {
    mode: 'view' | 'edit';
    type: 'Tenant' | 'Employee' | 'Owner';
    data: ModalData;
  };
  onClose: () => void;
  detailTab: 'details' | 'scorecard';
  onDetailTabChange: (tab: 'details' | 'scorecard') => void;
  onScoreClick: (type: 'Tenant' | 'Employee', id: number, name: string) => void;
  getScore: (type: 'Tenant' | 'Employee', id: number) => any;
  getScoreHistory: (type: 'Tenant' | 'Employee', id: number) => any[];
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-slate-50 rounded-lg p-3">
    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</p>
    <p className="text-slate-900 font-medium break-words">{value || '-'}</p>
  </div>
);

const ViewModal: React.FC<ViewModalProps> = ({
  modal,
  onClose,
  detailTab,
  onDetailTabChange,
  onScoreClick,
  getScore,
  getScoreHistory,
}) => {
  const { mode, type, data } = modal;

  const renderDocuments = (documents: any[]) => {
    if (!documents || documents.length === 0) return null;

    const imageDocs = documents.filter((doc: any) => 
      doc.mimetype?.startsWith('image/') || 
      /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(doc.originalName || doc.filename || '')
    );
    const otherDocs = documents.filter((doc: any) => 
      !doc.mimetype?.startsWith('image/') && 
      !/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(doc.originalName || doc.filename || '')
    );

    return (
      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Documents</h4>
        
        {imageDocs.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Images</h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imageDocs.map((doc: any, idx: number) => {
                const imageUrl = `${API_BASE_URL.replace('/api', '')}${doc.url}`;
                const imageName = doc.originalName || doc.filename || 'Image';
                
                return (
                  <div
                    key={doc.id || doc.url || idx}
                    className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-all hover:shadow-md"
                  >
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={imageName}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-2 bg-white border-t border-gray-200">
                        <p className="text-xs text-gray-700 font-medium truncate" title={imageName}>
                          {imageName}
                        </p>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {otherDocs.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">
              {imageDocs.length > 0 ? 'Other Documents' : 'Documents'}
            </h5>
            <div className="space-y-2">
              {otherDocs.map((doc: any, idx: number) => (
                <a
                  key={doc.id || doc.url || idx}
                  href={`${API_BASE_URL.replace('/api', '')}${doc.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-blue-300"
                >
                  <DocumentTextIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex-1 truncate" title={doc.originalName || doc.filename}>
                    {doc.originalName || doc.filename}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if ((type === 'Tenant' || type === 'Employee') && detailTab === 'scorecard') {
      return (
        <ScoreCardView
          type={type}
          id={data.id}
          name={data.name || ''}
          onUpdateClick={() => onScoreClick(type, data.id, data.name || '')}
          getScore={getScore}
          getScoreHistory={getScoreHistory}
        />
      );
    }

    return (
      <div className="space-y-4">
        {type === 'Tenant' && (
          <>
            <div className="flex justify-center mb-6">
              {data.profilePhoto ? (
                <img 
                  src={`${API_BASE_URL.replace('/api', '')}${data.profilePhoto}`} 
                  alt={data.name || 'Tenant'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-2xl';
                      fallback.textContent = `${data.firstName?.charAt(0) || ''}${data.lastName?.charAt(0) || ''}`.toUpperCase();
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-2xl">
                  {`${data.firstName?.charAt(0) || ''}${data.lastName?.charAt(0) || ''}`.toUpperCase() || data.name?.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="First Name" value={data.firstName || data.name?.split(' ')[0] || ''} />
              <Info label="Last Name" value={data.lastName || data.name?.split(' ')[1] || ''} />
              <Info label="Full Name" value={data.name || ''} />
              <Info label="Status" value={data.status || ''} />
              <Info label="Email" value={data.email || ''} />
              <Info label="Phone" value={data.phone || ''} />
              {data.alternatePhone && <Info label="Alternate Phone" value={data.alternatePhone} />}
              <Info label="Gender" value={data.gender || ''} />
              <Info label="Date of Birth" value={data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'N/A'} />
              <Info label="CNIC Number" value={data.cnicNumber || 'N/A'} />
              <Info label="Hostel" value={data.hostel || 'N/A'} />
              <Info label="Floor" value={data.floor || 'N/A'} />
              <Info label="Room" value={data.room || 'N/A'} />
              <Info label="Bed" value={data.bed || 'N/A'} />
              <Info label="Lease Start Date" value={data.leaseStartDate ? new Date(data.leaseStartDate).toLocaleDateString() : 'N/A'} />
              <Info label="Lease End Date" value={data.leaseEndDate ? new Date(data.leaseEndDate).toLocaleDateString() : 'N/A'} />
              <Info label="Monthly Rent" value={data.monthlyRent ? `$${data.monthlyRent.toLocaleString()}` : 'N/A'} />
              <Info label="Security Deposit" value={data.securityDeposit ? `$${data.securityDeposit.toLocaleString()}` : 'N/A'} />
              {data.checkInDate && <Info label="Check-In Date" value={new Date(data.checkInDate).toLocaleDateString()} />}
              {data.expectedCheckOutDate && <Info label="Expected Check-Out Date" value={new Date(data.expectedCheckOutDate).toLocaleDateString()} />}
              {data.rating !== undefined && <Info label="Rating" value={data.rating.toString()} />}
              {data.notes && <Info label="Notes" value={data.notes} />}
            </div>
            
            {data.documents && renderDocuments(data.documents)}
          </>
        )}

        {type === 'Employee' && (
          <>
            <div className="flex justify-center mb-6">
              {data.profilePhoto ? (
                <img 
                  src={`${API_BASE_URL.replace('/api', '')}${data.profilePhoto}`} 
                  alt={data.name || 'Employee'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-2xl">
                  {(() => {
                    const nameParts = data.name?.split(' ') || [];
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts[1] || '';
                    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || data.name?.charAt(0).toUpperCase();
                  })()}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Name" value={data.name || ''} />
              <Info label="Status" value={data.status || ''} />
              <Info label="Email" value={data.email || ''} />
              <Info label="Phone" value={data.phone || 'N/A'} />
              <Info label="Employee Code" value={data.employeeCode || 'N/A'} />
              <Info label="Role" value={data.role || 'N/A'} />
              {data.department && <Info label="Department" value={data.department} />}
              {data.designation && <Info label="Designation" value={data.designation} />}
              <Info label="Join Date" value={data.joinDate ? new Date(data.joinDate).toLocaleDateString() : 'N/A'} />
              <Info label="Contract End Date" value={data.terminationDate ? new Date(data.terminationDate).toLocaleDateString() : 'N/A'} />
              {data.salary && <Info label="Salary" value={`${data.salary} (${data.salaryType || 'monthly'})`} />}
              {data.workingHours && <Info label="Working Hours" value={data.workingHours} />}
              {data.hostel && <Info label="Hostel" value={data.hostel} />}
              {data.address && (
                <>
                  {data.address.street && <Info label="Street" value={data.address.street} />}
                  {data.address.city && <Info label="City" value={data.address.city} />}
                  {data.address.country && <Info label="Country" value={data.address.country} />}
                </>
              )}
              {data.notes && <Info label="Notes" value={data.notes} />}
              {data.createdAt && <Info label="Created At" value={new Date(data.createdAt).toLocaleDateString()} />}
              {data.updatedAt && <Info label="Updated At" value={new Date(data.updatedAt).toLocaleDateString()} />}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Access Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Username" value={data.username || 'N/A'} />
                <Info label="Account Status" value={data.status || ''} />
                <Info label="Hostel Access" value={data.hostel || 'N/A'} />
                <Info label="Access Role" value={data.user?.userRole || data.role || 'N/A'} />
              </div>
            </div>
            
            {data.documents && renderDocuments(data.documents)}
          </>
        )}

        {type === 'Owner' && (
          <>
            <div className="flex justify-center mb-6">
              {data.profilePhoto ? (
                <img 
                  src={`${API_BASE_URL.replace('/api', '')}${data.profilePhoto}`} 
                  alt={data.name || 'Owner'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center font-bold text-2xl">
                  {data.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Name" value={data.name || ''} />
              <Info label="Status" value={data.status || ''} />
              <Info label="Email" value={data.email || 'N/A'} />
              <Info label="Phone" value={data.phone || 'N/A'} />
              {data.alternatePhone && <Info label="Alternate Phone" value={data.alternatePhone} />}
              {data.ownerCode && <Info label="Owner Code" value={data.ownerCode} />}
              {data.HostelName && <Info label="Hostel Name" value={data.HostelName} />}
              {data.taxId && <Info label="Tax ID" value={data.taxId} />}
              {data.registrationNumber && <Info label="Registration Number" value={data.registrationNumber} />}
              {data.address && (
                <>
                  {data.address.city && <Info label="City" value={data.address.city} />}
                  {data.address.state && <Info label="State" value={data.address.state} />}
                </>
              )}
              {data.hostelCount !== undefined && <Info label="Total Hostels" value={data.hostelCount.toString()} />}
              {data.notes && <Info label="Notes" value={data.notes} />}
              {data.createdAt && <Info label="Created At" value={new Date(data.createdAt).toLocaleDateString()} />}
              {data.updatedAt && <Info label="Updated At" value={new Date(data.updatedAt).toLocaleDateString()} />}
            </div>
            
            {data.documents && renderDocuments(data.documents)}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 flex-shrink-0 ${
          mode === 'view' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-amber-500 to-orange-600'
        }`}>
          <div>
            <h3 className="text-xl font-bold text-white">
              {mode === 'view' ? 'View Details' : 'Edit Details'} — {type}
            </h3>
            <p className="text-white/80 text-sm">{data?.name}</p>
          </div>
          <button onClick={onClose} className="text-white/90 hover:text-white text-lg">×</button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Tabs - Only show for Tenant and Employee */}
          {(type === 'Tenant' || type === 'Employee') && (
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => onDetailTabChange('details')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  detailTab === 'details'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => onDetailTabChange('scorecard')}
                className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  detailTab === 'scorecard'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrophyIcon className="w-4 h-4" />
                Score Card 🏆
              </button>
            </div>
          )}

          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default ViewModal;

