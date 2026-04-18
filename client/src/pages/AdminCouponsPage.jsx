import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../lib/api";
import { formatNaira } from "../lib/productUtils";

const emptyForm = {
  code: "",
  description: "",
  discountType: "percentage",
  amount: "",
  minOrderValue: "",
  maxDiscount: "",
  expiresAt: "",
  isActive: true,
};

function AdminCouponsPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchCoupons = useCallback(async () => {
    try {
      const data = await apiRequest("/admin/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(data);
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setFormData({
      code: coupon.code || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "percentage",
      amount: coupon.amount || "",
      minOrderValue: coupon.minOrderValue || "",
      maxDiscount: coupon.maxDiscount || "",
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 10) : "",
      isActive: Boolean(coupon.isActive),
    });
  };

  const resetForm = () => {
    setEditingId("");
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await apiRequest(editingId ? `/admin/coupons/${editingId}` : "/admin/coupons", {
        method: editingId ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      setSuccessMessage(editingId ? "Coupon updated successfully" : "Coupon created successfully");
      resetForm();
      fetchCoupons();
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await apiRequest(`/admin/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Coupon deleted successfully");
      fetchCoupons();
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading align-left">
          <span className="section-tag">Admin</span>
          <h2>Coupon Management</h2>
          <p>Create store discounts, minimum order rules, and active promo campaigns from one place.</p>
        </div>

        {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
        {successMessage ? <div className="form-message success">{successMessage}</div> : null}

        <div className="dashboard-grid admin-dashboard-grid">
          <div className="dashboard-card">
            <h3>{editingId ? "Edit Coupon" : "Create Coupon"}</h3>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-grid two-col">
                <div className="form-group">
                  <label>Coupon Code</label>
                  <input name="code" value={formData.code} onChange={handleChange} required placeholder="WELCOME10" />
                </div>
                <div className="form-group">
                  <label>Discount Type</label>
                  <select name="discountType" value={formData.discountType} onChange={handleChange}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>
              <div className="form-grid two-col">
                <div className="form-group">
                  <label>Amount</label>
                  <input name="amount" type="number" min="0" value={formData.amount} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Minimum Order</label>
                  <input name="minOrderValue" type="number" min="0" value={formData.minOrderValue} onChange={handleChange} />
                </div>
              </div>
              <div className="form-grid two-col">
                <div className="form-group">
                  <label>Maximum Discount</label>
                  <input name="maxDiscount" type="number" min="0" value={formData.maxDiscount} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input name="expiresAt" type="date" value={formData.expiresAt} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} placeholder="Welcome coupon for first-time buyers" />
              </div>
              <label className="remember-wrap">
                <input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} />
                <span>Coupon is active</span>
              </label>
              <div className="product-actions">
                <button type="submit" className="btn btn-primary">{editingId ? "Update Coupon" : "Create Coupon"}</button>
                {editingId ? <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button> : null}
              </div>
            </form>
          </div>

          <div className="dashboard-card wide-card">
            <div className="card-title-row">
              <h3>Available Coupons</h3>
            </div>
            {loading ? <p className="muted-line">Loading coupons...</p> : null}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Minimum</th>
                    <th>Status</th>
                    <th>Expires</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td>{coupon.code}</td>
                      <td>{coupon.discountType}</td>
                      <td>{coupon.discountType === "fixed" ? formatNaira(coupon.amount) : `${coupon.amount}%`}</td>
                      <td>{formatNaira(coupon.minOrderValue || 0)}</td>
                      <td><span className={`status-badge ${coupon.isActive ? "success" : "warning"}`}>{coupon.isActive ? "Active" : "Paused"}</span></td>
                      <td>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "No expiry"}</td>
                      <td>
                        <div className="table-action-group">
                          <button type="button" className="btn btn-outline small-btn" onClick={() => handleEdit(coupon)}>Edit</button>
                          <button type="button" className="btn btn-outline small-btn" onClick={() => handleDelete(coupon._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="7">No coupons yet.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminCouponsPage;
