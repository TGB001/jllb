import React, { useRef, useState } from 'react';
export const UserContext = React.createContext({});

export default function UserProvider({ children }) {
  const [allCompletionCnt, setAllCompletionCnt] = useState(0);
  const initData = {};
  const userData = useRef(initData);
  const userShareData = useRef({});
  return (
    <UserContext.Provider
      value={{
        allCompletionCnt,
        setAllCompletionCnt,
        userData: userData,
        userShareData: userShareData,
        setUserData: (newData = {}) => {
          userData.current = newData;
        },
        setUserShareData: (newData = {}) => {
          userShareData.current = {
            ...userShareData.current,
            ...newData,
          };
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
