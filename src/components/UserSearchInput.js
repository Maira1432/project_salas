import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

const UserSearchInput = ({ onSelect }) => {
  const { instance, accounts } = useMsal();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        searchUsers(query);
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchUsers = async (text) => {
    try {
      const tokenRes = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const res = await fetch(
        `https://graph.microsoft.com/v1.0/users?$filter=startswith(displayName,'${text}') or startswith(mail,'${text}')&$top=5`,
        {
          headers: {
            Authorization: `Bearer ${tokenRes.accessToken}`,
          },
        }
      );

      const data = await res.json();
      setResults(data.value || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const handleSelect = (user) => {
    onSelect(user.mail);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar por nombre o correo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded-lg shadow z-10 max-h-40 overflow-auto">
          {results.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              🧍 {user.displayName} – <span className="text-gray-500">{user.mail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearchInput;