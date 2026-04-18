export const NIGERIAN_STATES = [
  "Kano",
  "Kaduna",
  "Abuja",
  "Lagos",
  "Oyo",
  "Rivers",
  "Katsina",
  "Jigawa",
  "Plateau",
  "Borno",
];

export const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export function getDeliveryFee(state, shippingMethod) {
  if (shippingMethod === "Pickup") return 0;
  const fees = {
    Kano: 1500,
    Kaduna: 2500,
    Abuja: 3000,
    Lagos: 3500,
  };
  return fees[state] || 2800;
}

export function getEstimatedDelivery(state, shippingMethod) {
  if (shippingMethod === "Pickup") return "Ready for pickup within 24 hours";
  if (state === "Kano") return "1 - 2 business days";
  if (["Kaduna", "Abuja"].includes(state)) return "2 - 3 business days";
  return "3 - 5 business days";
}

export function getStatusLabel(status) {
  return String(status || "pending").replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/, " ").toUpperCase());
}

export function getStatusTone(status) {
  const normalized = String(status || "pending").toLowerCase();
  if (normalized === "delivered") return "success";
  if (normalized === "cancelled") return "danger";
  if (["paid", "processing", "shipped"].includes(normalized)) return "info";
  return "warning";
}
