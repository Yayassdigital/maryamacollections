import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const emptyVariant = () => ({ color: "", size: "", material: "", stock: "", sku: "" });

function AdminAddProductPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    discountPrice: "",
    discountPercent: "",
    category: "Classic",
    description: "",
    stock: "",
    isFeatured: false,
    newArrival: true,
    badge: "",
    colors: "",
    sizes: "",
    materials: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [variants, setVariants] = useState([emptyVariant()]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const previewUrls = useMemo(() => imageFiles.map((file) => URL.createObjectURL(file)), [imageFiles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files || []).slice(0, 6));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const addVariantRow = () => setVariants((prev) => [...prev, emptyVariant()]);
  const removeVariantRow = (index) => setVariants((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, String(value)));
      payload.append("variants", JSON.stringify(variants));
      imageFiles.forEach((file) => payload.append("images", file));

      await apiRequest("/admin/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      setSuccessMessage("Product created successfully");
      toast.success("Product created successfully");
      setTimeout(() => navigate("/admin/products"), 800);
    } catch (err) {
      setErrorMessage(err.message);
      toast.error(err.message);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-tag">Admin</span>
          <h2>Add Product</h2>
          <p>Create premium products with gallery images, discount logic, badges, and real variants.</p>
        </div>

        <div className="auth-card admin-form-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
            {successMessage ? <div className="form-message success">{successMessage}</div> : null}

            <div className="form-grid two-column-grid">
              <div className="form-group"><label>Product Name</label><input name="name" value={formData.name} onChange={handleChange} required /></div>
              <div className="form-group"><label>Slug</label><input name="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated if left blank" /></div>
              <div className="form-group"><label>Price</label><input name="price" type="number" min="0" value={formData.price} onChange={handleChange} required /></div>
              <div className="form-group"><label>Discount Price</label><input name="discountPrice" type="number" min="0" value={formData.discountPrice} onChange={handleChange} /></div>
              <div className="form-group"><label>Discount Percent</label><input name="discountPercent" type="number" min="0" max="100" value={formData.discountPercent} onChange={handleChange} /></div>
              <div className="form-group"><label>Category</label><select name="category" value={formData.category} onChange={handleChange}><option value="Classic">Classic</option><option value="Luxury">Luxury</option><option value="Bridal">Bridal</option><option value="Casual">Casual</option></select></div>
              <div className="form-group"><label>Fallback Stock</label><input name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} /></div>
              <div className="form-group"><label>Custom Badge</label><input name="badge" value={formData.badge} onChange={handleChange} placeholder="Luxury Pick / Bridal Special" /></div>
            </div>

            <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} required rows="4" /></div>
            <div className="form-group"><label>Product Gallery (up to 6 images)</label><input name="images" type="file" accept="image/*" multiple onChange={handleImageChange} /></div>
            {previewUrls.length ? <div className="media-preview-grid">{previewUrls.map((url) => <img key={url} src={url} alt="Preview" className="media-preview-card" />)}</div> : null}

            <div className="form-grid three-column-grid">
              <div className="form-group"><label>Colors</label><input name="colors" value={formData.colors} onChange={handleChange} placeholder="Red, Blue, Gold" /></div>
              <div className="form-group"><label>Sizes</label><input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="Small, Medium, Large" /></div>
              <div className="form-group"><label>Materials</label><input name="materials" value={formData.materials} onChange={handleChange} placeholder="Silk, Cotton, Velvet" /></div>
            </div>

            <div className="variant-builder">
              <div className="variant-builder-head">
                <div><h3>Product Variants</h3><p>Add color, size, material, and stock for each product variation.</p></div>
                <button type="button" className="btn btn-outline small-btn" onClick={addVariantRow}>Add Variant</button>
              </div>
              {variants.map((variant, index) => (
                <div className="variant-row" key={`variant-${index}`}>
                  <input type="text" placeholder="Color" value={variant.color} onChange={(e) => handleVariantChange(index, "color", e.target.value)} />
                  <input type="text" placeholder="Size" value={variant.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} />
                  <input type="text" placeholder="Material" value={variant.material} onChange={(e) => handleVariantChange(index, "material", e.target.value)} />
                  <input type="number" min="0" placeholder="Stock" value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} />
                  <input type="text" placeholder="SKU" value={variant.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} />
                  <button type="button" className="btn btn-outline small-btn" onClick={() => removeVariantRow(index)}>Remove</button>
                </div>
              ))}
            </div>

            <div className="filter-actions-row">
              <label className="remember-wrap"><input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} /><span>Featured Product</span></label>
              <label className="remember-wrap"><input name="newArrival" type="checkbox" checked={formData.newArrival} onChange={handleChange} /><span>Mark as New Arrival</span></label>
            </div>

            <button type="submit" className="btn btn-primary auth-btn">Save Product</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AdminAddProductPage;
