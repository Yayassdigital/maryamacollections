const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || "").replace(/\/$/, "");

export function getProductId(product) {
  return product?._id || product?.id || "";
}

export function parsePrice(value) {
  if (typeof value === "number") return value;
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

export function formatNaira(value) {
  return `₦${parsePrice(value).toLocaleString()}`;
}

export function getProductBadge(product) {
  if (product?.badge) return product.badge;
  if (product?.newArrival) return "New Arrival";
  if (product?.isFeatured) return "Featured";
  if (product?.discountPrice > 0 || product?.discountPercent > 0) return `-${product.discountPercent || 0}% Off`;
  if (product?.stock <= 0) return "Out of Stock";
  if (product?.stock > 0 && product?.stock <= 5) return "Limited Stock";
  return product?.category || product?.tag || "Product";
}

export function resolveImageUrl(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image) || image.startsWith("blob:")) return image;
  if (image.startsWith("/")) {
    return API_ORIGIN ? `${API_ORIGIN}${image}` : image;
  }
  return image;
}

export function getSellingPrice(product) {
  const price = parsePrice(product?.price);
  const discountPrice = parsePrice(product?.discountPrice);
  return discountPrice > 0 ? discountPrice : price;
}

export function getProductHandle(product) {
  return product?.slug || getProductId(product);
}

export function getProductImages(product) {
  const sourceImages = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : [product?.image].filter(Boolean);
  return sourceImages.map(resolveImageUrl).filter(Boolean);
}

export function normalizeVariants(variants = []) {
  if (!Array.isArray(variants)) return [];
  return variants
    .map((variant, index) => ({
      id: variant?._id || variant?.id || `variant-${index + 1}`,
      color: variant?.color || "",
      size: variant?.size || "",
      material: variant?.material || "",
      stock: Number(variant?.stock || 0),
      sku: variant?.sku || `VAR-${index + 1}`,
      label: [variant?.color, variant?.size, variant?.material].filter(Boolean).join(" / ") || `Variant ${index + 1}`,
    }))
    .filter((variant) => variant.label || variant.stock >= 0);
}

export function normalizeReview(review) {
  if (!review) return null;
  return {
    ...review,
    id: review._id || review.id,
    rating: Number(review.rating || 0),
    createdAt: review.createdAt || null,
    name: review.name || "Customer",
    title: review.title || "",
    comment: review.comment || "",
    isHidden: Boolean(review.isHidden),
  };
}

export function normalizeProduct(product) {
  if (!product) return null;

  const id = getProductId(product);
  const price = parsePrice(product.price);
  const discountPrice = parsePrice(product.discountPrice);
  const sellingPrice = getSellingPrice({ price, discountPrice });
  const variants = normalizeVariants(product.variants);
  const images = getProductImages(product);
  const reviews = Array.isArray(product.reviews) ? product.reviews.map(normalizeReview).filter(Boolean) : [];
  const totalStock = variants.length > 0
    ? variants.reduce((sum, item) => sum + Number(item.stock || 0), 0)
    : Number(product.stock || 0);

  return {
    ...product,
    id,
    _id: product._id || id,
    price,
    discountPrice,
    discountPercent: Number(product.discountPercent || (discountPrice > 0 && price > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0)),
    sellingPrice,
    displayPrice: formatNaira(sellingPrice),
    originalPrice: discountPrice > 0 ? formatNaira(price) : "",
    tag: getProductBadge({ ...product, stock: totalStock, discountPercent: Number(product.discountPercent || 0) }),
    description:
      product.description ||
      "Elegant premium turban for fashion-conscious women who want comfort, beauty, and confidence.",
    image: images[0] || resolveImageUrl(product.image || ""),
    images,
    variants,
    reviews,
    rating: Number(product.rating || 0),
    numReviews: Number(product.numReviews || reviews.filter((review) => !review.isHidden).length || 0),
    colors: product.colors || [...new Set(variants.map((item) => item.color).filter(Boolean))],
    sizes: product.sizes || [...new Set(variants.map((item) => item.size).filter(Boolean))],
    materials: product.materials || [...new Set(variants.map((item) => item.material).filter(Boolean))],
    stock: totalStock,
    badge: product.badge || "",
    newArrival: Boolean(product.newArrival),
  };
}

export function buildCartItemKey(productId, selectedVariant = null) {
  const variantKey = selectedVariant?.id || selectedVariant?.sku || "default";
  return `${productId}::${variantKey}`;
}
