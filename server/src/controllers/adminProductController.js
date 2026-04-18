import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

const parseNumber = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  return value === "true" || value === "on" || value === "1";
};

const parseList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseVariants = (value, existingVariants = []) => {
  if (value === undefined || value === null || value === "") return existingVariants;

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) return existingVariants;

    return parsed
      .map((variant, index) => ({
        color: variant?.color?.trim?.() || "",
        size: variant?.size?.trim?.() || "",
        material: variant?.material?.trim?.() || "",
        stock: parseNumber(variant?.stock, 0),
        sku: variant?.sku?.trim?.() || `VAR-${index + 1}`,
      }))
      .filter((variant) => variant.color || variant.size || variant.material || variant.stock > 0);
  } catch {
    return existingVariants;
  }
};

const slugify = (value = "") => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
};

const ensureUniqueSlug = async (baseSlug, existingId = null) => {
  const normalizedBase = baseSlug || `product-${Date.now()}`;
  let candidate = normalizedBase;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({ slug: candidate });
    if (!existing || String(existing._id) === String(existingId)) {
      return candidate;
    }

    candidate = `${normalizedBase}-${counter}`;
    counter += 1;
  }
};

const buildImageUrl = (req, filename) => {
  if (!filename) return "";
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

const deleteLocalImage = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes("/uploads/")) return;

  const filename = imageUrl.split("/uploads/")[1];
  if (!filename) return;

  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const getUploadedImages = (req) => {
  const uploadedFiles = Array.isArray(req.files) ? req.files : [];
  return uploadedFiles.map((file) => buildImageUrl(req, file.filename)).filter(Boolean);
};

const unique = (items = []) => [...new Set(items.filter(Boolean))];

const buildDiscountValues = (price, incomingDiscountPrice, incomingDiscountPercent, existingProduct) => {
  const resolvedPrice = parseNumber(price, existingProduct?.price || 0);
  let discountPrice = parseNumber(incomingDiscountPrice, existingProduct?.discountPrice || 0);
  let discountPercent = parseNumber(incomingDiscountPercent, existingProduct?.discountPercent || 0);

  if (discountPercent > 0 && resolvedPrice > 0 && (!discountPrice || discountPrice >= resolvedPrice)) {
    discountPrice = Math.max(resolvedPrice - (resolvedPrice * discountPercent) / 100, 0);
  }

  if (discountPrice > 0 && resolvedPrice > 0) {
    discountPercent = Math.round(((resolvedPrice - discountPrice) / resolvedPrice) * 100);
  } else {
    discountPrice = 0;
    discountPercent = 0;
  }

  return { discountPrice, discountPercent };
};

const normalizeProductPayload = async (req, existingProduct = null) => {
  const name = req.body.name?.trim() || existingProduct?.name || "";
  const rawSlug = req.body.slug?.trim() || name || existingProduct?.slug || "";
  const slug = await ensureUniqueSlug(slugify(rawSlug), existingProduct?._id);

  const variants = parseVariants(req.body.variants, existingProduct?.variants || []);
  const uploadedImages = getUploadedImages(req);
  const existingImages = existingProduct?.images || (existingProduct?.image ? [existingProduct.image] : []);
  const incomingImages = uploadedImages.length > 0 ? uploadedImages : existingImages;

  const colors = unique([...parseList(req.body.colors), ...variants.map((item) => item.color)]);
  const sizes = unique([...parseList(req.body.sizes), ...variants.map((item) => item.size)]);
  const materials = unique([...parseList(req.body.materials), ...variants.map((item) => item.material)]);

  const variantStockTotal = variants.reduce((sum, item) => sum + parseNumber(item.stock, 0), 0);
  const rawStock = parseNumber(req.body.stock, existingProduct?.stock || 0);
  const stock = variants.length > 0 ? variantStockTotal : rawStock;

  const { discountPrice, discountPercent } = buildDiscountValues(
    req.body.price,
    req.body.discountPrice,
    req.body.discountPercent,
    existingProduct
  );

  return {
    name,
    slug,
    description: req.body.description?.trim() || existingProduct?.description || "",
    price: parseNumber(req.body.price, existingProduct?.price || 0),
    discountPrice,
    discountPercent,
    category: req.body.category?.trim() || existingProduct?.category || "Classic",
    image: incomingImages[0] || "",
    images: incomingImages,
    stock,
    isFeatured:
      req.body.isFeatured !== undefined
        ? parseBoolean(req.body.isFeatured)
        : existingProduct?.isFeatured || false,
    newArrival:
      req.body.newArrival !== undefined
        ? parseBoolean(req.body.newArrival)
        : existingProduct?.newArrival || false,
    badge: String(req.body.badge || existingProduct?.badge || "").trim(),
    colors,
    sizes,
    materials,
    variants,
  };
};

export const adminGetProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin products", error: error.message });
  }
};

export const adminGetSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

export const adminCreateProduct = async (req, res) => {
  try {
    const payload = await normalizeProductPayload(req);
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const adminUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const previousImages = product.images?.length ? [...product.images] : product.image ? [product.image] : [];
    Object.assign(product, await normalizeProductPayload(req, product));

    const updatedProduct = await product.save();

    if (Array.isArray(req.files) && req.files.length > 0) {
      previousImages.forEach((imageUrl) => {
        if (!updatedProduct.images.includes(imageUrl)) {
          deleteLocalImage(imageUrl);
        }
      });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const adminToggleReviewVisibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.isHidden = !review.isHidden;
    const visibleReviews = product.reviews.filter((item) => !item.isHidden);
    product.numReviews = visibleReviews.length;
    product.rating = visibleReviews.length
      ? Number((visibleReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / visibleReviews.length).toFixed(1))
      : 0;

    await product.save();

    res.status(200).json({
      message: review.isHidden ? "Review hidden successfully" : "Review restored successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review visibility", error: error.message });
  }
};

export const adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const images = product.images?.length ? product.images : product.image ? [product.image] : [];
    images.forEach((imageUrl) => deleteLocalImage(imageUrl));
    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};
