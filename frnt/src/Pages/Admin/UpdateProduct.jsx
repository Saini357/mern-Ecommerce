import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { AuthContext } from "../../context/AuthProvider";

function UpdateProduct() {
  const params = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const webUrl = process.env.URL || "http://localhost:7894";

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    shipping: "",
    image: [],
    category: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [Id, setId] = useState();
  //   console.log(Id);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setProduct({
      ...product,
      image: files,
    });
    setSelectedFiles(Array.from(files).map((file) => file.name));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${webUrl}/product/delete/${Id}`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      toast.success("Product deleted successfully");
      navigate("/dashboard/admin/product");
    } catch (error) {
      console.log(error, "error during the product delete process");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("quantity", product.quantity);
      formData.append("shipping", product.shipping);

      for (let i = 0; i < product.image.length; i++) {
        formData.append("image", product.image[i]);
      }

      await axios.put(`${webUrl}/product/update/${Id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/dashboard/admin/product");
      toast.success("Product Updated Successfully");
    } catch (error) {
      console.error("Error in product adding", error);
      toast.error(`${error.response.data.message}`);
    }
  };

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const { data } = await axios.get(
          `${webUrl}/product/single/${params.slug}`
        );

        if (data.data.length > 0) {
          const item = data.data[0];
          setProduct({
            ...product,
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: item.quantity,
            shipping: item.shipping,
            category: item.category._id,
            image: item.image,
          });
          setId(item._id);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error in fetching Single Product");
      }
    };

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

    getSingleProduct();
    getAllCategories();
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <form onSubmit={handleSubmit} className="m-1 w-75">
              <div>
                <Toaster />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Enter the name of the product"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="Enter the price of the product"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Write description for the product"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  placeholder="Enter the quantity of the product"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select mb-3"
                  size="large"
                  name="shipping"
                  value={product.shipping}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Shipping
                  </option>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <select
                className="form-select mb-3"
                size="large"
                name="category"
                value={product.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categories?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
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
              </div>
              <div className="mb-3 d-flex justify-content-between">
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary">
                    Update Product
                  </button>
                </div>
                <div className="mb-3">
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Delete Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UpdateProduct;
