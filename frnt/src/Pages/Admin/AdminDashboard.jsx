import React, { useContext } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { AuthContext } from "../../context/AuthProvider";

function AdminDashboard() {
  const { auth } = useContext(AuthContext);
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">{auth?.user?.name}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
