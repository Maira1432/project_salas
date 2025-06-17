import { loginRequest } from '../authConfig';

/**
 * Actualiza un evento existente en Outlook Calendar
 * @param {object} reservation - Reserva con outlookEventId, roomName, date, startTime, endTime, etc.
 * @param {PublicClientApplication} msalInstance - Instancia de MSAL
 * @param {object} account - Cuenta activa (ej: accounts[0])
 * @returns {Promise<boolean>} - true si la actualización fue exitosa, false si falló
 */
export const updateOutlookEvent = async (reservation, msalInstance, account) => {
  if (!reservation?.outlookEventId || !msalInstance || !account) {
    console.warn('Faltan datos para actualizar evento de Outlook');
    return false;
  }

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });

    const updatedEvent = {
      subject: `Reserva de sala: ${reservation.roomName || reservation.roomId}`,
      body: {
        contentType: 'HTML',
        content: `Reserva actualizada por ${reservation.user}`,
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
    };

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/me/events/${reservation.outlookEventId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      }
    );

    if (!res.ok) {
      console.error('Error al actualizar evento:', await res.json());
    }

    return res.ok;
  } catch (error) {
    console.error('Error MSAL o de red al actualizar Outlook:', error);
    return false;
  }
};