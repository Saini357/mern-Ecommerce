import toast, { Toaster } from "react-hot-toast";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import CategoryForm from "../../components/Form/CategoryForm";
import UpdateCategoryForm from "./UpdateCategoryForm";
import { AuthContext } from "../../context/AuthProvider";

function CreateCategory() {
  const webUrl = process.env.URL || "http://localhost:7894";
  const [categories, setCategories] = useState([]);
  const { auth } = useContext(AuthContext);
  const [Id, setId] = useState();
  const [name, setName] = useState();

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${webUrl}/category/all`);
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

  const deleteCategory = async (id) => {
    try {
      await axios.delete(
        `${webUrl}/category/delete/${id}`,

        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("category deleted successfull");
      // console.log(response.data.data.name);
      getAllCategories();
    } catch (error) {
      console.log(error, "error in deleting category");
    }
  };
  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div>
          <Toaster />
        </div>
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h3>Manage Category </h3>
            <div className="p-3">
              <CategoryForm v={getAllCategories} />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-primary ms-2"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => {
                            setId(item._id);
                            setName(item.name);
                          }}
                        >
                          edit
                        </button>

                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => deleteCategory(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  <div
                    class="modal"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                  >
                    <div class="modal-dialog">
                      <div class="modal-content" style={{ border: "none" }}>
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Update Category name
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                          ></button>
                        </div>
                        <UpdateCategoryForm
                          passName={name}
                          passId={Id}
                          v={getAllCategories}
                        />
                      </div>
                    </div>
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateCategory;
