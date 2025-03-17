import React, { createContext, useState } from 'react';

export const FormDataContext = createContext(null);

export const FormDataContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};
