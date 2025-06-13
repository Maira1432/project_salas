import React from 'react';

const OutlookCalendarSyncButton = ({ reservation, onSyncSuccess }) => {
  const handleSync = () => {
    // Esta es una simulación de la integración con el calendario de Outlook.
    // En una aplicación real, necesitarías usar la API de Microsoft Graph
    // para crear eventos en el calendario del usuario.
    // Esto implicaría:
    // 1. Obtener un token de acceso con los permisos adecuados (Calendars.ReadWrite).
    // 2. Hacer una solicitud POST a la API de Microsoft Graph para crear el evento.

    console.log('Simulando sincronización con Outlook Calendar para la reserva:', reservation);

    // Simulación de éxito
    alert(`Reserva de ${reservation.user} en ${reservation.roomId} el ${reservation.date} a las ${reservation.time} sincronizada con Outlook.`);
    if (onSyncSuccess) {
      onSyncSuccess();
    }
  };

  return (
    <button
      onClick={handleSync}
      className="w-full mt-4 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4ZM5 6H19V8H5V6ZM19 20V10H5V20H19ZM12 13H10V15H12V13ZM14 13H16V15H14V13Z" />
      </svg>
      <span>Sincronizar con Outlook Calendar</span>
    </button>
  );
};

export default OutlookCalendarSyncButton;