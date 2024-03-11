import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const webUrl = process.env.URL || "http://localhost:7894";
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const initialValues = {
    name: "",
    email: "",
    password: "",
    number: "",
    confirmPassword: "",
    photo: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .test("is-uppercase", "First letter should be in uppercase", (value) =>
        /^[A-Z].*$/.test(value)
      )
      .min(3, "Name must have a minimum of 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must have a minimum of 6 characters")
      .max(20, "Password must have a maximum of 20 characters")
      .matches(
        /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])[\w!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,20}$/,
        "Password must have at least one special character and one uppercase letter"
      )
      .required("Password is required"),
    number: Yup.string()
      .length(10, "Phone number must be 10 digits")
      .required("Phone number is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    photo: Yup.mixed().required("Photo is required"),
  });

  const onSubmit = async (values) => {
    try {
      const data = {
        name: values.name,
        email: values.email,
        password: values.password,
        number: `+91${values.number}`,
        photo: values.photo,
      };

      const response = await axios.post(`${webUrl}/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast(`${response.data.data.name} is registered succefully`, {
        duration: 4000,
        position: "top-center",
        style: {
          width: "250px",
          color: "green",
          textAlign: "center",
          fontWeight: "bold",
        },
      });
      navigate("/login");

      // console.log(response.data.data.name);
      // console.log(response.data.success, "dad");
    } catch (error) {
      toast.error(`${error.response.data} `, {
        duration: 4000,
        position: "top-center",
        style: {
          width: "250px",
          color: "red",
          textAlign: "center",
          fontWeight: "bold",
        },
      });
      console.log(error.response, "error in register the user");
      // console.log(error.response.data, "error in register the user");
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
        <h3 className="tag">Registration Form</h3>
        <br />
        <div>
          <Toaster />
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="nameInput"
              placeholder="Enter your name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-danger">{formik.errors.name}</div>
            ) : null}
          </div>
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

          <div className="mb-3">
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="confirmPasswordInput"
                placeholder="Enter your confirm password"
                {...formik.getFieldProps("confirmPassword")}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-danger">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              id="photoInput"
              onChange={(event) =>
                formik.setFieldValue("photo", event.currentTarget.files[0])
              }
            />
          </div>
          {formik.touched.photo && formik.errors.photo ? (
            <div className="text-danger">{formik.errors.photo}</div>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              background: "#434343",
              border: "none",
              width: "100%",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Register;
