import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

function CategoryForm(props) {
  const webUrl = process.env.URL || "http://localhost:7894";
  const { auth } = useContext(AuthContext);

  const initialValues = {
    name: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const data = {
        name: values.name,
      };

      const response = await axios.post(`${webUrl}/category/add`, data, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);
      toast.success(`${response.data.category.name} is added successfully`);
      props.v();
      resetForm(); // Reset the form
    } catch (error) {
      console.error("Error adding category:", error.response);
      toast.error(error.response.data.message);
    } finally {
      setSubmitting(false); // Reset the submit button
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

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
            placeholder="Enter category name"
            {...formik.getFieldProps("name")}
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
}

export default CategoryForm;
