import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { getProductId, normalizeProduct } from "../lib/productUtils";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const getInitialWishlist = () => {
  const saved = localStorage.getItem("maryama_wishlist");
  if (!saved) return [];

  try {
    const parsedWishlist = JSON.parse(saved);
    return parsedWishlist.map((item) => normalizeProduct(item)).filter(Boolean);
  } catch {
    return [];
  }
};

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const toast = useToast();
  const [wishlistItems, setWishlistItems] = useState(getInitialWishlist);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem("maryama_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const syncWishlist = async () => {
      setSyncing(true);
      try {
        const localItems = getInitialWishlist();
        for (const item of localItems) {
          const productId = getProductId(item);
          if (productId) {
            await apiRequest("/auth/wishlist", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify({ productId }),
            });
          }
        }

        const data = await apiRequest("/auth/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(data.map((item) => normalizeProduct(item)).filter(Boolean));
      } catch {
        // keep local wishlist if sync fails
      } finally {
        setSyncing(false);
      }
    };

    syncWishlist();
  }, [isAuthenticated, token]);

  const addToWishlist = async (product) => {
    const normalizedProduct = normalizeProduct(product);
    const productId = getProductId(normalizedProduct);

    if (!productId) return;

    if (isAuthenticated && token) {
      const data = await apiRequest("/auth/wishlist", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId }),
      });
      setWishlistItems((data.wishlist || []).map((item) => normalizeProduct(item)).filter(Boolean));
      toast.success(data.message || "Wishlist updated");
      return;
    }

    setWishlistItems((prev) => {
      const exists = prev.find((item) => getProductId(item) === productId);
      if (exists) return prev;
      toast.success(`${normalizedProduct.name} saved to wishlist`);
      return [...prev, normalizedProduct];
    });
  };

  const removeFromWishlist = async (id) => {
    if (isAuthenticated && token) {
      const data = await apiRequest(`/auth/wishlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems((data.wishlist || []).map((item) => normalizeProduct(item)).filter(Boolean));
      toast.success(data.message || "Wishlist updated");
      return;
    }

    setWishlistItems((prev) => prev.filter((item) => getProductId(item) !== id));
    toast.info("Product removed from wishlist");
  };

  const isInWishlist = useCallback(
    (id) => wishlistItems.some((item) => getProductId(item) === id),
    [wishlistItems]
  );

  const value = {
    wishlistItems,
    syncing,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    totalWishlistItems: wishlistItems.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
