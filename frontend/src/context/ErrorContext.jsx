import React, { createContext, useContext, useState } from 'react';
import ErrorMessageModal from '../components/ErrorMessageModal';
import SuccessMessageModal from '../components/SuccessMessageModal';

// Error Context
const ErrorContext = createContext();
export const useError = () => useContext(ErrorContext);
export const ErrorProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const showError = (message) => {
    setErrorMessage(message);
  };
  const hideError = () => {
    setErrorMessage(null);
  };
  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      <ErrorMessageModal message={errorMessage} onClose={hideError} />
    </ErrorContext.Provider>
  );
};

// Success Context
const SuccessContext = createContext();
export const useSuccess = () => useContext(SuccessContext);
export const SuccessProvider = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const showSuccess = (message) => {
    setSuccessMessage(message);
  };
  const hideSuccess = () => {
    setSuccessMessage(null);
  };
  return (
    <SuccessContext.Provider value={{ showSuccess, hideSuccess }}>
      {children}
      <SuccessMessageModal message={successMessage} onClose={hideSuccess} />
    </SuccessContext.Provider>
  );
};
