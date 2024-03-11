import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();
function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  console.log(auth);
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: parseData.data,
        token: parseData.token,
      }));
    }
  }, []);
  return (
    <div>
      <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
      </AuthContext.Provider>
    </div>
  );
}

export default AuthProvider;
