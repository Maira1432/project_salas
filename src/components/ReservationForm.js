import React, { useState } from 'react';
import UserSearchInput from './UserSearchInput';
import { db } from "../firebaseConfig";
import { collection, addDoc, Timestamp, updateDoc } from "firebase/firestore";

const ReservationForm = ({ selectedRoom, onMakeReservation, onCancel, existingReservations, isEditing = false }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [user, setUser] = useState('');
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState('');

  // Horarios disponibles para la selección
  const availableTimes = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !time || !user) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Validar si la sala ya está reservada a esa hora y fecha
    const isConflict = existingReservations.some(
      (res) => res.roomId === selectedRoom.id && res.date === date && res.time === time
    );

    if (isConflict) {
      setError('Esta sala ya está reservada para la fecha y hora seleccionadas. Por favor, elige otro horario o sala.');
      return;
    }

    const totalAsistentes = 1 + guests.length; // 1 por el usuario principal
    if (totalAsistentes > selectedRoom.capacity) {
      setError(`Esta sala permite máximo ${selectedRoom.capacity} personas. Actualmente tienes ${totalAsistentes}.`);
      return;
    }

    const [startTime, endTime] = time.split('-');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const attendeeEmails = guests
      .map(g => g.email)
      .filter(email => emailRegex.test(email));

    if (guests.length > 0 && attendeeEmails.length === 0) {
      setError('Los correos de invitados ingresados no son válidos.');
      return;
    }

    try {
      const reserva = {
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        date,
        time,
        startTime,
        endTime,
        user,
        attendees: attendeeEmails,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, "reservas"), reserva);

      // Agregamos el ID al documento en Firestore
      await updateDoc(docRef, { firestoreId: docRef.id });

      const nuevaReserva = { id: docRef.id, firestoreId: docRef.id, ...reserva };
      onMakeReservation(nuevaReserva);

      if (!isEditing && typeof window.handleOutlookSync === 'function') {
        setTimeout(() => {
          window.handleOutlookSync(nuevaReserva);
        }, 500);
      }
    } catch (err) {
      console.error('Error al guardar en Firestore:', err);
      setError('Hubo un problema al realizar la reserva. Intenta nuevamente.');
    }
  };

  const asistentesActuales = 1 + guests.length;
  const limiteAlcanzado = asistentesActuales >= selectedRoom.capacity;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservar {selectedRoom.name}</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">¡Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
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
        <div className="mb-4">
          <label htmlFor="time" className="block text-gray-700 text-sm font-medium mb-2">Hora</label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            <option value="">Selecciona una hora</option>
            {availableTimes.map((hour) => (
              <option key={hour} value={hour}>{hour}</option>
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
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Invitados</label>
          <UserSearchInput
            onSelect={(user) => {
              if (!guests.find(g => g.email === user.email)) {
                setGuests([...guests, { name: user.name, email: user.email }]);
              }
            }}
            clearOnSelect={true}
            disabled={limiteAlcanzado}
          />
          {limiteAlcanzado && (
            <p className="text-sm text-red-600 mt-2">
              Has alcanzado el máximo de personas permitido para esta sala.
            </p>
          )}
          {guests.map((guest, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full mr-2 mt-2"
            >
              {guest.name || guest.email}
              <button
                type="button"
                onClick={() => {
                  setGuests(guests.filter(g => g.email !== guest.email));
                }}
                className="ml-2 text-gray-500 hover:text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
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
            disabled={limiteAlcanzado}
            className={`px-6 py-2 rounded-lg transition-colors ${
              limiteAlcanzado
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Confirmar Reserva
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;