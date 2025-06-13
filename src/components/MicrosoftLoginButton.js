import React from 'react';

const MicrosoftLoginButton = ({ onLogin }) => {
  // Esta es una simulación de un botón de login con Microsoft 365.
  // En una aplicación real, necesitarías integrar una librería de autenticación de Microsoft (como MSAL.js)
  // y configurar tu aplicación en Azure AD para manejar el flujo de OAuth 2.0.
  // Por ahora, solo simula un login exitoso.

  const handleLogin = () => {
    // Aquí iría la lógica real de autenticación con Microsoft 365
    // Por ejemplo: msalInstance.loginPopup(loginRequest);
    console.log('Simulando login con Microsoft 365...');
    // Simula un usuario logueado
    const userProfile = {
      name: 'Usuario Microsoft',
      email: 'usuario@empresa.com',
      id: 'ms-user-123',
    };
    onLogin(userProfile);
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9999 2.2C11.9999 2.09 11.9099 2 11.7999 2H6.2999C6.1899 2 6.0999 2.09 6.0999 2.2V6.09C6.0999 6.2 6.1899 6.29 6.2999 6.29H11.7999C11.9099 6.29 11.9999 6.2 11.9999 6.09V2.2Z" />
        <path d="M11.9999 6.29C11.9999 6.18 11.9099 6.09 11.7999 6.09H6.2999C6.1899 6.09 6.0999 6.18 6.0999 6.29V11.79C6.0999 11.9 6.1899 11.99 6.2999 11.99H11.7999C11.9099 11.99 11.9999 11.9 11.9999 11.79V6.29Z" />
        <path d="M17.7999 2.2C17.7999 2.09 17.7099 2 17.5999 2H12.0999C11.9899 2 11.8999 2.09 11.8999 2.2V6.09C11.8999 6.2 11.9899 6.29 12.0999 6.29H17.5999C17.7099 6.29 17.7999 6.2 17.7999 6.09V2.2Z" />
        <path d="M17.7999 6.29C17.7999 6.18 17.7099 6.09 17.5999 6.09H12.0999C11.9899 6.09 11.8999 6.18 11.8999 6.29V11.79C11.8999 11.9 11.9899 11.99 12.0999 11.99H17.5999C17.7099 11.99 17.7999 11.9 17.7999 11.79V6.29Z" />
        <path d="M11.9999 12.09C11.9999 11.98 11.9099 11.89 11.7999 11.89H6.2999C6.1899 11.89 6.0999 11.98 6.0999 12.09V17.59C6.0999 17.7 6.1899 17.79 6.2999 17.79H11.7999C11.9099 17.79 11.9999 17.7 11.9999 17.59V12.09Z" />
        <path d="M17.7999 12.09C17.7999 11.98 17.7099 11.89 17.5999 11.89H12.0999C11.9899 11.89 11.8999 11.98 11.8999 12.09V17.59C11.8999 17.7 11.9899 17.79 12.0999 17.79H17.5999C17.7099 17.79 17.7999 17.7 17.7999 17.59V12.09Z" />
      </svg>
      <span>Iniciar sesión con Microsoft 365</span>
    </button>
  );
};

export default MicrosoftLoginButton;