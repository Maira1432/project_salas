import React from 'react';

const RoomCard = ({ room, onSelectRoom }) => {
  const availabilityClass = room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const buttonClass = room.available ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
        <p className="text-gray-600 mb-1">Capacidad: {room.capacity} personas</p>
        <p className="text-gray-600 mb-4">
          Comodidades: {room.amenities.length > 0 ? room.amenities.join(', ') : 'Ninguna'}
        </p>
        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${availabilityClass}`}>
          {room.available ? 'Disponible' : 'No Disponible'}
        </span>
      </div>
      <button
        onClick={() => room.available && onSelectRoom(room)}
        className={`w-full mt-4 py-2 rounded-lg text-white transition-colors ${buttonClass}`}
        disabled={!room.available}
      >
        {room.available ? 'Reservar Sala' : 'No Disponible'}
      </button>
    </div>
  );
};

export default RoomCard;