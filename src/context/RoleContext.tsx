import React, { createContext, useState, useContext } from 'react';

export const RoleContext = createContext({
  role: '',
  setRole: (role: string) => {}
});

export const RoleProvider = ({ children }: any) => {
  const [role, setRole] = useState('');
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
