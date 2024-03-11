import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { AuthContext } from "../../context/AuthProvider";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const webUrl = process.env.URL || "http://localhost:7894";
  const { auth, setAuth } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const initialValues = {
    email: "",
    number: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email:
      loginMethod === "email"
        ? Yup.string().email("Invalid email").required("Email is required")
        : Yup.string(),
    number:
      loginMethod === "number"
        ? Yup.string().required("Phone number is required")
        : Yup.string(),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values) => {
    try {
      const data = {
        password: values.password,
      };

      if (loginMethod === "email") {
        data.email = values.email;
      } else {
        data.number = `+91${values.number}`;
      }

      const response = await axios.post(`${webUrl}/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("auth", JSON.stringify(response.data));
      setAuth({
        ...auth,
        user: response.data.data.user,
        token: response.data.data.token,
      });
      navigate(location.state || "/");
      console.log(response.data.data.user);
      console.log(response.data.data.token);
      toast.success(`${response.data.data.user.name} is login successfully`);
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
        duration: 4000,
        position: "top-center",
        style: {
          width: "250px",
          color: "red",
          textAlign: "center",
          fontWeight: "bold",
        },
      });
      console.log(error.response.data.message, "error in registering the user");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Layout>
      <div className="register">
        <h3 className="tag">Login Form</h3>
        <br />
        <div>
          <Toaster />
        </div>
        <form onSubmit={formik.handleSubmit}>
          {loginMethod === "email" ? (
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-danger">{formik.errors.email}</div>
              ) : null}
            </div>
          ) : (
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="phoneInput"
                placeholder="Enter your phone number"
                {...formik.getFieldProps("number")}
              />
              {formik.touched.number && formik.errors.number ? (
                <div className="text-danger">{formik.errors.number}</div>
              ) : null}
            </div>
          )}

          <div className="mb-3">
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="passwordInput"
                placeholder="Enter your password"
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger">{formik.errors.password}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="btn btn-link"
            onClick={() =>
              setLoginMethod(loginMethod === "email" ? "number" : "email")
            }
          >
            {loginMethod === "email"
              ? "Login via phone number"
              : "Login via email"}
          </button>

          <button
            type="button"
            className="btn btn-link"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot Password
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              background: "#434343",
              border: "none",
              width: "100%",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
