import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";

function Private() {
  const [ok, setOk] = useState(false);
  const { auth } = useContext(AuthContext);
  const webUrl = process.env.URL || "http://localhost:7894";
  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(`${webUrl}/user-auth`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);
  return <div>{ok ? <Outlet /> : <Spinner />}</div>;
}

export default Private;
