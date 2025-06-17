import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

const OutlookCalendarSyncButton = ({ reservation, onSyncSuccess, onDeleteOutlookEvent }) => {
  const { instance, accounts } = useMsal();

  const handleSync = async () => {
    try {
      const account = accounts[0];
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      const accessToken = response.accessToken;

      const event = {
        subject: `Reserva de sala: ${reservation.roomName || reservation.roomId}`,
        body: {
          contentType: 'HTML',
          content: `Reserva hecha por ${reservation.user}`,
        },
        start: {
          dateTime: `${reservation.date}T${reservation.startTime}`,
          timeZone: 'America/Bogota',
        },
        end: {
          dateTime: `${reservation.date}T${reservation.endTime}`,
          timeZone: 'America/Bogota',
        },
        location: {
          displayName: reservation.roomName || reservation.roomId,
        },
        attendees: [],
      };

      if (Array.isArray(reservation.attendees) && reservation.attendees.length > 0) {
        event.attendees = reservation.attendees.map(email => ({
          emailAddress: { address: email, name: email },
          type: 'required',
        }));
      }

      const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (graphResponse.ok) {
        const createdEvent = await graphResponse.json();
        alert(`Reserva de ${reservation.user} sincronizada con Outlook.`);
        if (onSyncSuccess) onSyncSuccess(createdEvent.id);
      } else {
        const error = await graphResponse.json();
        console.error('Error al crear evento:', error);
        alert('No se pudo sincronizar con Outlook.');
      }
    } catch (error) {
      console.error('Error de autenticación o red:', error);
      alert('Error al obtener el token de acceso.');
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