import React, { useContext, useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

function Products() {
  const webUrl = process.env.URL || "http://localhost:7894";
  const [products, setProducts] = useState([]);
  const { auth } = useContext(AuthContext);

  const getAllProducts = async () => {
    try {
      const data = await axios.get(`${webUrl}/product/all/products`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      setProducts(data.data.data);
    } catch (error) {
      console.log(error, "error in fetching the products ");
    }
  };

  useEffect(() => {
    getAllProducts();
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
            <h3 className="text-center">All Products List</h3>
            <div className="d-flex">
              {products?.map((item) => (
                <Link to={`/dashboard/admin/product/${item.slug}`}>
                  <div
                    className="card m-2"
                    style={{ width: "18rem" }}
                    key={item._id}
                  >
                    <Carousel>
                      {item.image.map((path, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={`http://localhost:7894/${path}`}
                            className="d-block w-100"
                            alt={path}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Products;

// import React, { useEffect, useState } from "react";
// import AdminMenu from "../../components/Layout/AdminMenu";
// import Layout from "../../components/Layout/Layout";
// import axios from "axios";
// import { Carousel } from "react-bootstrap";
// import { Link } from "react-router-dom";

// function Products() {
//   const webUrl = process.env.URL || "http://localhost:7894";
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage] = useState(6); // Change this number to adjust products per page

//   const getAllProducts = async () => {
//     try {
//       const data = await axios.get(`${webUrl}/product/all-products`);
//       setProducts(data.data.data);
//     } catch (error) {
//       console.log(error, "error in fetching the products ");
//     }
//   };

//   useEffect(() => {
//     getAllProducts();
//   }, []);

//   // Get current products
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = products.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <Layout>
//       <div className="row">
//         <div className="col-md-3">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9">
//           <h3 className="text-center">All Products List</h3>
//           <div className="d-flex flex-wrap">
//             {currentProducts?.map((item) => (
//               <Link to={`/dashboard/admin/product/${item.slug}`} key={item._id}>
//                 <div className="card m-2" style={{ width: "18rem" }}>
//                   <Carousel>
//                     {item.image.map((path, index) => (
//                       <Carousel.Item key={index}>
//                         <img
//                           src={`http://localhost:7894/${path}`}
//                           className="d-block w-100"
//                           alt={path}
//                         />
//                       </Carousel.Item>
//                     ))}
//                   </Carousel>
//                   <div className="card-body">
//                     <h5 className="card-title">{item.name}</h5>
//                     <p className="card-text">{item.description}</p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//           <nav className="mt-4">
//             <ul className="pagination justify-content-center">
//               {[
//                 ...Array(Math.ceil(products.length / productsPerPage)).keys(),
//               ].map((number) => (
//                 <li key={number} className="page-item">
//                   <button
//                     onClick={() => paginate(number + 1)}
//                     className="page-link"
//                   >
//                     {number + 1}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default Products;
