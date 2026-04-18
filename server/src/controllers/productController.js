import mongoose from "mongoose";
import Product from "../models/Product.js";

const parseNumber = (value, fallback = undefined) => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildPublicProduct = (product) => {
  const plain = product.toObject ? product.toObject() : product;
  return {
    ...plain,
    reviews: (plain.reviews || []).filter((review) => !review.isHidden),
  };
};

const recalculateDerivedFields = async (product) => {
  let hasChanges = false;

  if ((!product.images || product.images.length === 0) && product.image) {
    product.images = [product.image];
    hasChanges = true;
  }

  if ((!product.image || !product.image.trim()) && product.images?.length) {
    product.image = product.images[0];
    hasChanges = true;
  }

  if ((!product.colors || product.colors.length === 0) && product.variants?.length) {
    product.colors = [...new Set(product.variants.map((item) => item.color).filter(Boolean))];
    hasChanges = true;
  }

  if ((!product.sizes || product.sizes.length === 0) && product.variants?.length) {
    product.sizes = [...new Set(product.variants.map((item) => item.size).filter(Boolean))];
    hasChanges = true;
  }

  if ((!product.materials || product.materials.length === 0) && product.variants?.length) {
    product.materials = [...new Set(product.variants.map((item) => item.material).filter(Boolean))];
    hasChanges = true;
  }

  const derivedStock = product.variants?.length
    ? product.variants.reduce((sum, item) => sum + (Number(item.stock) || 0), 0)
    : Number(product.stock || 0);

  if (Number(product.stock || 0) !== derivedStock) {
    product.stock = derivedStock;
    hasChanges = true;
  }

  if (Number(product.discountPrice || 0) > 0 && Number(product.price || 0) > 0) {
    const discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);
    if (Number(product.discountPercent || 0) !== discountPercent) {
      product.discountPercent = discountPercent;
      hasChanges = true;
    }
  } else if (Number(product.discountPercent || 0) !== 0) {
    product.discountPercent = 0;
    hasChanges = true;
  }

  const visibleReviews = (product.reviews || []).filter((review) => !review.isHidden);
  const numReviews = visibleReviews.length;
  const rating = numReviews
    ? visibleReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / numReviews
    : 0;

  if (Number(product.numReviews || 0) !== numReviews) {
    product.numReviews = numReviews;
    hasChanges = true;
  }

  if (Number(product.rating || 0) !== Number(rating.toFixed(1))) {
    product.rating = Number(rating.toFixed(1));
    hasChanges = true;
  }

  if (hasChanges) {
    await product.save();
  }

  return product;
};

const buildProductFilter = (query = {}) => {
  const filter = {};

  if (query.search) {
    const regex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { name: regex },
      { description: regex },
      { category: regex },
      { colors: regex },
      { sizes: regex },
      { materials: regex },
      { "variants.color": regex },
      { "variants.size": regex },
      { "variants.material": regex },
      { badge: regex },
    ];
  }

  if (query.category && query.category !== "All") {
    filter.category = query.category.trim();
  }

  if (query.availability === "in-stock") {
    filter.stock = { $gt: 0 };
  }

  if (query.availability === "out-of-stock") {
    filter.stock = { $lte: 0 };
  }

  const minPrice = parseNumber(query.minPrice);
  const maxPrice = parseNumber(query.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  if (query.featured === "true") {
    filter.isFeatured = true;
  }

  if (query.newArrival === "true") {
    filter.newArrival = true;
  }

  return filter;
};

const buildSort = (sort = "newest") => {
  switch (sort) {
    case "price-asc":
      return { discountPrice: 1, price: 1, createdAt: -1 };
    case "price-desc":
      return { discountPrice: -1, price: -1, createdAt: -1 };
    case "featured":
      return { isFeatured: -1, createdAt: -1 };
    case "name-asc":
      return { name: 1 };
    case "rating":
      return { rating: -1, numReviews: -1, createdAt: -1 };
    default:
      return { createdAt: -1 };
  }
};

export const getProducts = async (req, res) => {
  try {
    const filter = buildProductFilter(req.query);
    const sort = buildSort(req.query.sort);

    const products = await Product.find(filter).sort(sort);
    const normalizedProducts = await Promise.all(products.map((product) => recalculateDerivedFields(product)));

    res.status(200).json(normalizedProducts.map((product) => buildPublicProduct(product)));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featured = await Product.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(8);

    if (featured.length === 0) {
      featured = await Product.find().sort({ createdAt: -1 }).limit(4);
    }

    const normalizedProducts = await Promise.all(featured.map((product) => recalculateDerivedFields(product)));
    res.status(200).json(normalizedProducts.map((product) => buildPublicProduct(product)));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured products", error: error.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params;

    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ _id: slug }, { slug }] }
      : { slug };

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const normalizedProduct = await recalculateDerivedFields(product);
    res.status(200).json(buildPublicProduct(normalizedProduct));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const reviewRating = Number(rating);

    if (!reviewRating || reviewRating < 1 || reviewRating > 5 || !String(comment || "").trim()) {
      return res.status(400).json({ message: "Rating and review comment are required" });
    }

    const { slug } = req.params;
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ _id: slug }, { slug }] }
      : { slug };

    const product = await Product.findOne(query);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find((review) => String(review.user) === String(req.user._id));
    if (alreadyReviewed) {
      alreadyReviewed.rating = reviewRating;
      alreadyReviewed.title = String(title || "").trim();
      alreadyReviewed.comment = String(comment || "").trim();
      alreadyReviewed.isHidden = false;
    } else {
      product.reviews.push({
        user: req.user._id,
        name: req.user.name,
        rating: reviewRating,
        title: String(title || "").trim(),
        comment: String(comment || "").trim(),
      });
    }

    await recalculateDerivedFields(product);
    res.status(201).json({ message: alreadyReviewed ? "Review updated successfully" : "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save review", error: error.message });
  }
};
