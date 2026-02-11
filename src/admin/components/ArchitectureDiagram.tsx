import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';
import type { ArchitectureData } from '../types/hostel';

interface ArchitectureDiagramProps {
  data: ArchitectureData;
  onAddSeat?: (floorNumber: number, roomId: string) => void;
  onRoomClick?: (floorNumber: number) => void;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  data,
  onAddSeat,
  onRoomClick,
}) => {
  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Total Rooms</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {data.totalRooms}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-sm text-green-600 font-medium">Available Seats</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {data.availableSeats}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <p className="text-sm text-red-600 font-medium">Occupied Seats</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {data.occupiedSeats}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-sm text-slate-600 font-medium">Total Seats</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {data.totalSeats}
          </p>
        </div>
      </div>

      {/* Floors */}
      <div className="space-y-6">
        {data.floors.map((floor) => (
          <motion.div
            key={floor.floorNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm"
          >
            {/* Architecture Header (renamed from Floor) */}
            <div className="mb-4 pb-4 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">
                Architecture
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {floor.rooms.length} rooms
              </p>
            </div>

            {/* Block Label - Appears once before room cards */}
            <div className="mb-3">
              <p className="text-sm font-semibold text-slate-700">
                Block {floor.floorNumber}
              </p>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {floor.rooms.map((room) => (
                <motion.div
                  key={room.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4 hover:border-blue-400 transition-colors"
                >
                  {/* Room Number - Clickable to add room */}
                  <div 
                    className="text-center mb-3 cursor-pointer"
                    onClick={() => onRoomClick && onRoomClick(floor.floorNumber)}
                    title="Click to add a new room to this block"
                  >
                    <p className="text-sm font-semibold text-slate-600">
                      Room
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {room.roomNumber}
                    </p>
                  </div>

                  {/* Seats */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {room.seats.map((seat) => (
                      <Tooltip
                        key={seat.id}
                        content={
                          seat.isOccupied
                            ? `Seat occupied by ${seat.tenantName || 'Unknown'}`
                            : 'Available seat'
                        }
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${
                            seat.isOccupied
                              ? 'bg-red-500 border-red-600 text-white'
                              : 'bg-green-500 border-green-600 text-white'
                          }`}
                          title={
                            seat.isOccupied
                              ? `Occupied by ${seat.tenantName}`
                              : 'Available'
                          }
                        >
                          {seat.seatNumber}
                        </motion.div>
                      </Tooltip>
                    ))}
                    {/* Add Seat Button */}
                    {onAddSeat && (
                      <motion.button
                        onClick={() => onAddSeat(floor.floorNumber, room.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 rounded-full border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 hover:border-blue-500 flex items-center justify-center text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        title="Add New Seat"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>

                  {/* Room Info */}
                  <div className="mt-2 text-center">
                    <p className="text-xs text-slate-500">
                      {room.seats.filter((s) => s.isOccupied).length}/
                      {room.totalSeats} occupied
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Legend</h4>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-600"></div>
            <span className="text-sm text-slate-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-600"></div>
            <span className="text-sm text-slate-700">Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
};

