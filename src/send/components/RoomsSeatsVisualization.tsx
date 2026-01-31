interface Seat {
  id: string;
  number: string;
  status: 'available' | 'occupied';
  occupantName?: string;
}

interface Room {
  id: string;
  number: string;
  seats: Seat[];
}

interface Floor {
  id: string;
  number: string;
  rooms: Room[];
}

interface RoomsSeatsVisualizationProps {
  floors: Floor[];
  selectedFloor?: string;
  onFloorChange?: (floorId: string) => void;
  showOnlyAvailable?: boolean;
  onShowOnlyAvailableChange?: (value: boolean) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

const RoomsSeatsVisualization = ({
  floors,
  selectedFloor,
  onFloorChange,
  showOnlyAvailable = false,
  onShowOnlyAvailableChange,
  searchQuery = '',
  onSearchQueryChange,
}: RoomsSeatsVisualizationProps) => {
  const filteredFloors = floors.filter((floor) => {
    if (selectedFloor && floor.id !== selectedFloor) return false;
    return true;
  });

  const filterRooms = (rooms: Room[]) => {
    return rooms.filter((room) => {
      if (searchQuery && !room.number.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (showOnlyAvailable) {
        return room.seats.some((seat) => seat.status === 'available');
      }
      return true;
    });
  };

  const getSeatColor = (status: 'available' | 'occupied') => {
    return status === 'available' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Floor Selector */}
          {floors.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
              <select
                value={selectedFloor || ''}
                onChange={(e) => onFloorChange?.(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Floors</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    Floor {floor.number}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Room Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Room</label>
            <input
              type="text"
              placeholder="Search by room number..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange?.(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Only Available Seats Toggle */}
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => onShowOnlyAvailableChange?.(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Only available seats</span>
            </label>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Occupied</span>
        </div>
      </div>

      {/* Floors Display */}
      <div className="space-y-12">
        {filteredFloors.map((floor) => {
          const filteredRooms = filterRooms(floor.rooms);
          if (filteredRooms.length === 0) return null;

          return (
            <div key={floor.id} className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Floor {floor.number}
              </h3>
              
              {/* Rooms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-soft-md transition-shadow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Room {room.number}
                    </h4>
                    
                    {/* Seats Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {room.seats.map((seat) => (
                        <div
                          key={seat.id}
                          className="relative group"
                        >
                          <div
                            className={`w-full aspect-square ${getSeatColor(seat.status)} rounded-full cursor-pointer hover:opacity-80 transition-opacity`}
                            title={
                              seat.status === 'available'
                                ? `Seat #${seat.number} — Available`
                                : `Seat #${seat.number} — Occupied by ${seat.occupantName || 'Unknown'}`
                            }
                          />
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                              {seat.status === 'available' ? (
                                `Seat #${seat.number} — Available`
                              ) : (
                                `Seat #${seat.number} — Occupied by ${seat.occupantName || 'Unknown'}`
                              )}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-3">
                      {room.seats.filter((s) => s.status === 'available').length} of {room.seats.length} seats available
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomsSeatsVisualization;

