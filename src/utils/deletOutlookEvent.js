import { loginRequest } from '../authConfig';

/**
 * Elimina un evento de Outlook Calendar usando Microsoft Graph API
 * @param {string} eventId - ID del evento de Outlook
 * @param {PublicClientApplication} msalInstance - Instancia de MSAL
 * @param {object} account - Cuenta activa (ej: accounts[0])
 * @returns {Promise<boolean>} - true si se eliminó correctamente, false si falló
 */
export const deleteOutlookEvent = async (eventId, msalInstance, account) => {
  if (!eventId || !msalInstance || !account) {
    console.warn('Faltan datos necesarios para eliminar el evento de Outlook');
    return false;
  }

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });

    const deleteRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      }
    );

    return deleteRes.ok;
  } catch (error) {
    console.error('Error al eliminar el evento de Outlook:', error);
    return false;
  }
};