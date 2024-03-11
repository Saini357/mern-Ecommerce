import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ProductForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const webUrl = process.env.URL || "http://localhost:7894";
  const { auth } = useContext(AuthContext);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${webUrl}/category/all-categories`);
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const initialValues = {
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
    category: "",
    shipping: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("name is required"),
    price: Yup.number()
      .positive("must be a positive number")
      .typeError("must be a number")
      .integer("must be an integer")
      .required("required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    quantity: Yup.number()
      .positive("Cannot be negative")
      .typeError("Must be a number")
      .required("Required"),
    shipping: Yup.boolean().required("Shipping is required"),
    image: Yup.mixed().required("image are required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    values.shipping = values.shipping === "true" ? true : false;
    console.log("Shipping value:", values.image);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("quantity", values.quantity);
      formData.append("shipping", values.shipping);

      if (values.image) {
        for (let i = 0; i < values.image.length; i++) {
          formData.append("image", values.image[i]);
        }
      }

      const response = await axios.post(`${webUrl}/product/create`, formData, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data, "saaaaaaaa");
      toast.success("Product Added Successfully");
      navigate("/dashboard/admin/product");
      resetForm();
    } catch (error) {
      console.log(error, "error in product adding");

      toast.error(`${error.response.data.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  // Handle file change
  const handleFileChange = (event) => {
    formik.setFieldValue("image", event.currentTarget.files);
    setSelectedFiles(
      Array.from(event.currentTarget.files).map((file) => file.name)
    );
  };
  return (
    <form onSubmit={formik.handleSubmit} className="m-1 w-75">
      <div>
        <Toaster />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Enter the name of the product"
          className="form-control"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-danger">{formik.errors.name}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="price"
          placeholder="Enter the price of the product"
          className="form-control"
          {...formik.getFieldProps("price")}
        />
        {formik.touched.price && formik.errors.price ? (
          <div className="text-danger">{formik.errors.price}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <textarea
          type="text"
          name="description"
          placeholder="Write description for the product"
          className="form-control"
          {...formik.getFieldProps("description")}
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="text-danger">{formik.errors.description}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="quantity"
          placeholder="Enter the quantity of the product"
          className="form-control"
          {...formik.getFieldProps("quantity")}
        />
        {formik.touched.quantity && formik.errors.quantity ? (
          <div className="text-danger">{formik.errors.quantity}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <select
          className="form-select mb-3"
          size="large"
          {...formik.getFieldProps("shipping")}
        >
          <option value="" selected disabled>
            Select Shipping
          </option>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>

        {formik.touched.shipping && formik.errors.shipping ? (
          <div className="text-danger">{formik.errors.shipping}</div>
        ) : null}
      </div>

      <select
        className="form-select mb-3"
        size="large"
        {...formik.getFieldProps("category")}
      >
        <option value="">Select category</option>
        {categories?.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
      {formik.touched.category && formik.errors.category ? (
        <div className="text-danger">{formik.errors.category}</div>
      ) : null}

      <div className="mb-3">
        <label className="btn btn-outline-secondary">
          Upload image
          <input
            type="file"
            name="image"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </label>
        {selectedFiles.map((fileName, index) => (
          <div key={index}>{fileName}</div>
        ))}
        {formik.touched.image && formik.errors.image ? (
          <div className="text-danger">{formik.errors.image}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
