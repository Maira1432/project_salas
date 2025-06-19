import React from 'react';

const RoomCard = ({ room, onSelectRoom, reservations }) => {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const isCurrentlyOccupied = reservations.some(res =>
    res.roomId === room.id &&
    res.date === currentDate &&
    res.startTime <= currentTime &&
    res.endTime > currentTime
  );

  const reservasHoy = reservations
    .filter(res => res.roomId === room.id && res.date === currentDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const availabilityClass = !isCurrentlyOccupied ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const buttonClass = !isCurrentlyOccupied ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
        <p className="text-gray-600 mb-1">Capacidad: {room.capacity} personas</p>
        <p className="text-gray-600 mb-4">
          Comodidades: {room.amenities.length > 0 ? room.amenities.join(', ') : 'Ninguna'}
        </p>
        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${availabilityClass}`}>
          {!isCurrentlyOccupied ? 'Disponible' : 'Ocupado'}
        </span>
        
      {reservasHoy.length > 0 && (
        <ul className="mt-2 text-sm text-gray-600">
          <li className="font-medium">Reservas hoy:</li>
          {reservasHoy.map(res => {
            const isActive = res.startTime <= currentTime && res.endTime > currentTime;
            return (
              <li
                key={res.id}
                className={isActive ? 'font-semibold text-black' : ''}
              >
                {res.startTime} - {res.endTime} por {res.user}
              </li>
            );
          })}
        </ul>
      )}
      </div>
      <button
        onClick={() => !isCurrentlyOccupied && onSelectRoom(room)}
        className={`w-full mt-4 py-2 rounded-lg text-white transition-colors ${buttonClass}`}
        disabled={isCurrentlyOccupied}
      >
        {!isCurrentlyOccupied ? 'Reservar Sala' : 'No Disponible'}
      </button>
    </div>
  );
};

export default RoomCard;