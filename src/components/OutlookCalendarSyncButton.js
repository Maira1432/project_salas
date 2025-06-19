import { useEffect } from 'react';
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

  useEffect(() => {
    if (
      reservation &&
      reservation.date &&
      reservation.startTime &&
      reservation.endTime
    ) {
      handleSync();
    }
  }, []);

  return null;
};

export default OutlookCalendarSyncButton;