import React from "react";
import { NavLink } from "react-router-dom";

function AdminMenu() {
  return (
    <div classNameName="text-center">
      <div className="list-group">
        <h4>Admin Panel</h4>

        <NavLink
          to="/dashboard/admin/create-category"
          className="list-group-item list-group-item-action"
        >
          Create Category
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-Product"
          className="list-group-item list-group-item-action"
        >
          Create Product
        </NavLink>
        <NavLink
          to="/dashboard/admin/product"
          className="list-group-item list-group-item-action"
        >
          Product
        </NavLink>
        <NavLink
          to="/dashboard/admin/users"
          className="list-group-item list-group-item-action"
        >
          Users
        </NavLink>
      </div>
    </div>
  );
}

export default AdminMenu;
