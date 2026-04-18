import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const emptyAddress = () => ({
  label: "Home",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "Nigeria",
  isDefault: false,
});

function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [savedAddresses, setSavedAddresses] = useState([emptyAddress()]);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setSavedAddresses(user?.savedAddresses?.length ? user.savedAddresses : [emptyAddress()]);
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressChange = (index, field, value) => {
    setSavedAddresses((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        if (field === "isDefault") {
          return { ...item, isDefault: value };
        }
        return { ...item, [field]: value };
      }).map((item, idx) => (field === "isDefault" ? { ...item, isDefault: idx === index ? value : false } : item))
    );
  };

  const addAddress = () => setSavedAddresses((prev) => [...prev, emptyAddress()]);
  const removeAddress = (index) => setSavedAddresses((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setProfileMessage("");

    try {
      const data = await updateProfile({ ...formData, savedAddresses });
      setProfileMessage(data.message || "Profile updated successfully");
      toast.success(data.message || "Profile updated successfully");
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      toast.error(error.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setPasswordMessage("");

    try {
      const data = await changePassword(passwordData);
      setPasswordMessage(data.message || "Password changed successfully");
      toast.success(data.message || "Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading align-left">
          <span className="section-tag">Profile</span>
          <h2>Manage Your Account</h2>
          <p>Keep your customer details, saved delivery addresses, and password up to date.</p>
        </div>

        {errorMessage ? <div className="form-message error">{errorMessage}</div> : null}
        {profileMessage ? <div className="form-message success">{profileMessage}</div> : null}
        {passwordMessage ? <div className="form-message success">{passwordMessage}</div> : null}

        <div className="dashboard-grid admin-dashboard-grid">
          <div className="dashboard-card wide-card">
            <h3>Account Details</h3>
            <form className="auth-form" onSubmit={handleProfileSubmit}>
              <div className="form-grid two-col">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" value={formData.name} onChange={handleProfileChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleProfileChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleProfileChange} placeholder="Enter your active phone number" />
              </div>

              <div className="card-title-row profile-address-head">
                <h3>Saved Delivery Addresses</h3>
                <button type="button" className="btn btn-outline small-btn" onClick={addAddress}>Add Address</button>
              </div>

              <div className="profile-address-stack">
                {savedAddresses.map((address, index) => (
                  <div className="address-card" key={`address-${index}`}>
                    <div className="form-grid two-col">
                      <div className="form-group">
                        <label>Label</label>
                        <input value={address.label || ""} onChange={(e) => handleAddressChange(index, "label", e.target.value)} placeholder="Home / Office" />
                      </div>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input value={address.fullName || ""} onChange={(e) => handleAddressChange(index, "fullName", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-grid two-col">
                      <div className="form-group">
                        <label>Phone</label>
                        <input value={address.phone || ""} onChange={(e) => handleAddressChange(index, "phone", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input value={address.address || ""} onChange={(e) => handleAddressChange(index, "address", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-grid three-column-grid">
                      <div className="form-group">
                        <label>City</label>
                        <input value={address.city || ""} onChange={(e) => handleAddressChange(index, "city", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input value={address.state || ""} onChange={(e) => handleAddressChange(index, "state", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Country</label>
                        <input value={address.country || ""} onChange={(e) => handleAddressChange(index, "country", e.target.value)} />
                      </div>
                    </div>
                    <div className="filter-actions-row">
                      <label className="remember-wrap compact-check">
                        <input type="checkbox" checked={Boolean(address.isDefault)} onChange={(e) => handleAddressChange(index, "isDefault", e.target.checked)} />
                        <span>Default address</span>
                      </label>
                      <button type="button" className="btn btn-outline small-btn" onClick={() => removeAddress(index)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary auth-btn">Save Profile</button>
            </form>
          </div>

          <div className="dashboard-card">
            <h3>Change Password</h3>
            <form className="auth-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-outline auth-btn">Update Password</button>
            </form>

            <div className="summary-stack profile-mini-stats">
              <div className="summary-row"><span>Role</span><strong>{user?.role || "user"}</strong></div>
              <div className="summary-row"><span>Saved Addresses</span><strong>{user?.savedAddresses?.length || 0}</strong></div>
              <div className="summary-row"><span>Wishlist Items</span><strong>{user?.wishlistCount || 0}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
