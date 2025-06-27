import React from 'react';
import { deleteOutlookEvent } from '../utils/deleteOutlookEvent';

const ReservationList = ({ reservations, rooms, onEditReservation, onDeleteReservation }) => {
  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Sala Desconocida';
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Reservas</h2>
      {reservations.length === 0 ? (
        <p className="text-gray-600 text-center">No tienes reservas activas.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">{getRoomName(reservation.roomId)}</p>
                <p className="text-gray-600">Fecha: {reservation.date}</p>
                <p className="text-gray-600">Hora: {reservation.time}</p>
                <p className="text-gray-600">Reservado por: {reservation.user}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    console.log("Reserva seleccionada para editar:", reservation);
                    onEditReservation(reservation);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={async () => {
                    if (reservation.outlookEventId) {
                      await deleteOutlookEvent(reservation.outlookEventId, window.msalInstance, window.account);
                    }
                    onDeleteReservation(reservation);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationList;