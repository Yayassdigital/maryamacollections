export const stripUnsafe = (value = "") => {
  return String(value)
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
};

export const sanitizeArray = (items = []) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => stripUnsafe(item)).filter(Boolean);
};

export const sanitizeAddress = (address = {}) => ({
  label: stripUnsafe(address.label || ""),
  fullName: stripUnsafe(address.fullName || ""),
  phone: stripUnsafe(address.phone || ""),
  address: stripUnsafe(address.address || ""),
  city: stripUnsafe(address.city || ""),
  state: stripUnsafe(address.state || ""),
  country: stripUnsafe(address.country || "Nigeria"),
  isDefault: Boolean(address.isDefault),
});

export const isValidEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim().toLowerCase());
export const isStrongPassword = (value = "") => {
  const password = String(value);
  return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
};
