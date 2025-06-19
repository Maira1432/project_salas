export const msalConfig = {
  auth: {
    clientId: '8d23218d-b8bc-4af1-b072-c48bfbe0c1d3',
    authority: 'https://login.microsoftonline.com/0c4fa9d7-8fb7-4395-99a2-3674e4f8f773',
    redirectUri: 'https://project-salas.onrender.com', // o 'http://localhost:3000' si estás en desarrollo
  },
  cache: {
    cacheLocation: 'localStorage', // O 'sessionStorage'
    storeAuthStateInCookie: false, // true si necesitas compatibilidad con IE11
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'Calendars.ReadWrite', 'User.ReadBasic.All'],
};