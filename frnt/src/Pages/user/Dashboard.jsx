import React, { useContext } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { AuthContext } from "../../context/AuthProvider";

function Dashboard() {
  const { auth } = useContext(AuthContext);
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              {auth?.user?.name}
              {auth?.user?.email}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
