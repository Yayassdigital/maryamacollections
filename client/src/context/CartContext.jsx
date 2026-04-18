import { createContext, useContext, useEffect, useState } from "react";
import { buildCartItemKey, getProductId, getSellingPrice, normalizeProduct } from "../lib/productUtils";
import { useToast } from "./ToastContext";

const getInitialCart = () => {
  const savedCart = localStorage.getItem("maryama_cart");
  if (!savedCart) return [];

  try {
    const parsedCart = JSON.parse(savedCart);
    return parsedCart.map((item) => normalizeProduct(item)).filter(Boolean);
  } catch {
    return [];
  }
};

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem("maryama_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedVariant = null) => {
    const normalizedProduct = normalizeProduct(product);
    const productId = getProductId(normalizedProduct);
    if (!productId) return;

    const cartKey = buildCartItemKey(productId, selectedVariant);
    const stockLimit = selectedVariant ? Number(selectedVariant.stock || 0) : Number(normalizedProduct.stock || 0);

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.cartKey === cartKey);
      if (existingItem) {
        if (existingItem.quantity >= stockLimit && stockLimit > 0) {
          toast.warning("You already reached the available stock for this variant");
          return prev;
        }
        return prev.map((item) => (item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item));
      }

      toast.success(`${normalizedProduct.name} added to cart`);
      return [
        ...prev,
        {
          ...normalizedProduct,
          quantity: 1,
          selectedVariant,
          cartKey,
          stock: stockLimit || normalizedProduct.stock,
        },
      ];
    });
  };

  const removeFromCart = (cartKey) => {
    const removedItem = cartItems.find((item) => item.cartKey === cartKey);
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
    if (removedItem) toast.info(`${removedItem.name} removed from cart`);
  };

  const decreaseQuantity = (cartKey) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.cartKey === cartKey ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const increaseQuantity = (cartKey) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartKey !== cartKey) return item;
        const stockLimit = Number(item.selectedVariant?.stock || item.stock || 0);
        if (stockLimit > 0 && item.quantity >= stockLimit) return item;
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getSellingPrice(item) * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 2000 : 0;
  const total = subtotal + deliveryFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
