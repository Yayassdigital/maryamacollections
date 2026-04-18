import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatNaira, getProductImages, getSellingPrice } from "../lib/productUtils";

function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiRequest("/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  return (
    <section className="section">
      <div className="container">
        <div className="admin-topbar">
          <div>
            <span className="section-tag">Admin Products</span>
            <h2 className="admin-title">Manage Products</h2>
          </div>
          <Link to="/admin/products/add" className="btn btn-primary">Add New Product</Link>
        </div>

        {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
        {loading ? <p className="text-center">Loading products...</p> : null}

        {!loading ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Main Image</th>
                  <th>Name</th>
                  <th>Gallery</th>
                  <th>Variants</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const images = getProductImages(product);
                  return (
                    <tr key={product._id}>
                      <td>{images[0] ? <img src={images[0]} alt={product.name} style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "12px" }} /> : <span>No image</span>}</td>
                      <td>
                        <strong>{product.name}</strong>
                        <div className="product-subtext">{product.slug}</div>
                      </td>
                      <td>{images.length}</td>
                      <td>{product.variants?.length || 0}</td>
                      <td>{formatNaira(getSellingPrice(product))}</td>
                      <td>{product.stock}</td>
                      <td>{product.isFeatured ? "Yes" : "No"}</td>
                      <td className="admin-actions">
                        <Link to={`/admin/products/edit/${product._id}`} className="btn btn-outline small-btn">Edit</Link>
                        <button type="button" className="btn btn-primary small-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8">No products found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default AdminProductsPage;
