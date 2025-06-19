import React, { useState, useEffect } from 'react';

const EditReservationForm = ({ reservation, rooms, onUpdateReservation, onCancel }) => {
  const [date, setDate] = useState(reservation.date);
  const [time, setTime] = useState(reservation.time);
  const [user, setUser] = useState(reservation.user);
  const [selectedRoomId, setSelectedRoomId] = useState(reservation.roomId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time || !user || !selectedRoomId) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    const [startTime, endTime] = time.split('-');
    const roomName = rooms.find(r => r.id === selectedRoomId)?.name || selectedRoomId;
    onUpdateReservation({ ...reservation, roomId: selectedRoomId, roomName, date, time, startTime, endTime, user });
  };
  const horariosDisponibles = [
      '08:00 - 09:00',
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00',
      '17:00 - 18:00',
  ];
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Reserva</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="room" className="block text-gray-700 text-sm font-medium mb-2">Sala</label>
          <select
            id="room"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-2">Fecha</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="time" className="block text-gray-700 text-sm font-medium mb-2">Hora</label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            <option value="">Selecciona una hora</option>
            {horariosDisponibles.map((hora) => (
              <option key={hora} value={hora}>
                {hora}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="user" className="block text-gray-700 text-sm font-medium mb-2">Tu Nombre</label>
          <input
            type="text"
            id="user"
            placeholder="Nombre Completo"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Actualizar Reserva
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReservationForm;