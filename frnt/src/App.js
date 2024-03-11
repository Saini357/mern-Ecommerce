import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Policy from "./Pages/Policy";
import Home from "./Pages/Home";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Private from "./components/Routes/Private";
import Orders from "./Pages/user/Orders";
import Profile from "./Pages/user/Profile";
import Dashboard from "./Pages/user/Dashboard";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import CreateProduct from "./Pages/Admin/CreateProduct";
import CreateCategory from "./Pages/Admin/CreateCategory";
import Users from "./Pages/Admin/Users";
import Products from "./Pages/Admin/Products";
import UpdateProduct from "./Pages/Admin/UpdateProduct";
import AdminRoutes from "./components/Routes/AdminRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Private />}>
        <Route path="user" element={<Dashboard />} />
        <Route path="user/orders" element={<Orders />} />
        <Route path="user/profile" element={<Profile />} />
      </Route>

      <Route path="dashboard" element={<AdminRoutes />}>
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/create-Product" element={<CreateProduct />} />
        <Route path="admin/create-category" element={<CreateCategory />} />
        <Route path="admin/users" element={<Users />} />
        <Route path="admin/product" element={<Products />} />
        <Route path="admin/product/:slug" element={<UpdateProduct />} />
      </Route>
      <Route path="register" element={<Register />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="policy" element={<Policy />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
