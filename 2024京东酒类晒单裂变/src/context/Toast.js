import React, { useRef, useState, useCallback } from 'react';
import Toast from '@/components/Toast';
export const ToastContext = React.createContext({});

export default function ToastProvider({ children }) {
  const [toastText, setToastText] = useState('');

  const showToast = useCallback((text, time = 800) => {
    setToastText(text);
    setTimeout(() => {
      setToastText('');
    }, time);
  });
  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      <Toast text={toastText} />

      {children}
    </ToastContext.Provider>
  );
}
