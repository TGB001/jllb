import React, { useRef, useState } from 'react';
export const StatusContext = React.createContext({});

export default function StatusProvider({ children }) {
  const [prizeTwoStatus, setPrizeTwoStatus] = useState({
    prizeTwoGetDataFinished: false,
  });
  return (
    <StatusContext.Provider
      value={{
        prizeTwoStatus,
        setPrizeTwoStatus,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}
