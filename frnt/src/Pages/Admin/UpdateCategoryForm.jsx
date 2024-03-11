import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const UpdateCategoryForm = (props) => {
  const { passId, passName, v } = props;

  const webUrl = process.env.URL || "http://localhost:7894";
  const { auth } = useContext(AuthContext);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const data = {
        name: values.name,
      };

      const response = await axios.put(
        `${webUrl}/category/update/${passId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.data.name);
      toast.success(`${response.data.data.name} is updated successfully`);
      v();
      resetForm();
    } catch (error) {
      console.error("Error adding category:", error);

      toast.error(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: passName || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    formik.setFieldValue("name", passName || "");
  }, [passName]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <Toaster />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            name="name"
            id="name"
            value={formik.values.name}
            placeholder="Enter category name"
            onChange={formik.handleChange}
          />
        </div>
        {formik.touched.name && formik.errors.name ? (
          <div>{formik.errors.name}</div>
        ) : null}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default UpdateCategoryForm;
