import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Spinner({ path = "login" }) {
  const [count, setcount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setcount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`${path}`, {
        state: location.state,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);
  return (
    <div
      className="d-flex flex-columns justify-content-center align-item-center"
      style={{
        height: "100vh",
      }}
    >
      <h3>Redirecting to login page in {count} Seconds</h3>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
