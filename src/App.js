import React, { useState, useEffect } from 'react';
import { createStorage, getStorage, setStorage } from './utils/storage';
import { defaultRooms } from './mock/rooms';
import { defaultReservations } from './mock/reservations';
import RoomCard from './components/RoomCard';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import MicrosoftLoginButton from './components/MicrosoftLoginButton';
import EditReservationForm from './components/EditReservationForm';
import OutlookCalendarSyncButton from './components/OutlookCalendarSyncButton';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [rooms, setRooms] = useState(() => createStorage('rooms', defaultRooms));
  const [reservations, setReservations] = useState(() => createStorage('reservations', defaultReservations));
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);

  useEffect(() => {
    setStorage('rooms', rooms);
  }, [rooms]);

  useEffect(() => {
    setStorage('reservations', reservations);
  }, [reservations]);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setCurrentPage('form');
  };

  const handleMakeReservation = (newReservation) => {
    const newId = `RES${reservations.length + 1}`;
    const updatedReservations = [...reservations, { id: newId, ...newReservation }];
    setReservations(updatedReservations);
    alert('¡Reserva realizada con éxito!');
    setCurrentPage('list');
  };

  const handleUpdateReservation = (updatedReservation) => {
    // Validar si la sala ya está reservada a esa hora y fecha, excluyendo la reserva actual
    const isConflict = reservations.some(
      (res) =>
        res.id !== updatedReservation.id &&
        res.roomId === updatedReservation.roomId &&
        res.date === updatedReservation.date &&
        res.time === updatedReservation.time
    );

    if (isConflict) {
      alert('Error: Esta sala ya está reservada para la fecha y hora seleccionadas. Por favor, elige otro horario o sala.');
      return;
    }

    setReservations(reservations.map(res =>
      res.id === updatedReservation.id ? updatedReservation : res
    ));
    alert('Reserva actualizada con éxito!');
    setEditingReservation(null);
    setCurrentPage('list');
  };

  const handleDeleteReservation = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      setReservations(reservations.filter(res => res.id !== id));
      alert('Reserva eliminada.');
    }
  };

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation);
    setCurrentPage('edit');
  };

  const handleCancelForm = () => {
    setSelectedRoom(null);
    setCurrentPage('rooms');
  };

  const handleCancelEdit = () => {
    setEditingReservation(null);
    setCurrentPage('list');
  };

  const handleLoginSuccess = (userProfile) => {
    setCurrentUser(userProfile);
    setCurrentPage('rooms');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleSyncSuccess = () => {
    console.log('Sincronización con Outlook completada.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="bg-white p-6 rounded-2xl shadow-lg mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reserva de Salas FYCO</h1>
        {currentUser && (
          <nav className="space-x-4 flex items-center">
            <span className="text-gray-700 font-medium">Hola, {currentUser.name}!</span>
            <button
              onClick={() => setCurrentPage('rooms')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'rooms' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Salas Disponibles
            </button>
            <button
              onClick={() => setCurrentPage('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'list' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Mis Reservas
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </nav>
        )}
      </header>

      <main>
        {currentPage === 'login' && (
          <div className="flex justify-center items-center h-[calc(100vh-180px)]">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bienvenido a Reserva de Salas FYCO</h2>
              <p className="text-gray-600 mb-6">Inicia sesión para gestionar tus reservas de salas.</p>
              <MicrosoftLoginButton onLogin={handleLoginSuccess} />
            </div>
          </div>
        )}

        {currentUser && currentPage === 'rooms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onSelectRoom={handleSelectRoom} />
            ))}
          </div>
        )}

        {currentUser && currentPage === 'form' && selectedRoom && (
          <ReservationForm
            selectedRoom={selectedRoom}
            onMakeReservation={handleMakeReservation}
            onCancel={handleCancelForm}
            existingReservations={reservations} // Pasar las reservas existentes para la validación
          />
        )}

        {currentUser && currentPage === 'list' && (
          <>
            <ReservationList
              reservations={reservations}
              rooms={rooms}
              onEditReservation={handleEditReservation}
              onDeleteReservation={handleDeleteReservation}
            />
            {reservations.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">¿Quieres sincronizar tus reservas con Outlook?</p>
                <OutlookCalendarSyncButton reservation={reservations[0]} onSyncSuccess={handleSyncSuccess} />
              </div>
            )}
          </>
        )}

        {currentUser && currentPage === 'edit' && editingReservation && (
          <EditReservationForm
            reservation={editingReservation}
            rooms={rooms}
            onUpdateReservation={handleUpdateReservation}
            onCancel={handleCancelEdit}
          />
        )}
      </main>
    </div>
  );
};

export default App;

// DONE