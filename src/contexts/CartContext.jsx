// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      loadGuestCart();
    }
  }, [isAuthenticated, token]);

  const loadGuestCart = () => {
    const localCart = localStorage.getItem('guest_cart');
    if (localCart) {
      setCartItems(JSON.parse(localCart));
    } else {
      setCartItems([]);
    }
  };

  const saveGuestCart = (items) => {
    localStorage.setItem('guest_cart', JSON.stringify(items));
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, variant = null) => {
    if (!isAuthenticated) {
      // Guest cart logic
      const existingItemIndex = cartItems.findIndex(
        item => item.productId === productId && JSON.stringify(item.variant) === JSON.stringify(variant)
      );
      
      let newCart;
      if (existingItemIndex !== -1) {
        newCart = [...cartItems];
        newCart[existingItemIndex].quantity += quantity;
      } else {
        // Fetch product details for guest cart
        try {
          const productResponse = await fetch(`http://localhost:5000/api/products/${productId}`);
          const product = await productResponse.json();
          newCart = [...cartItems, {
            id: Date.now(),
            productId,
            name: product.product.name,
            price: product.product.price,
            image: product.product.images?.[0],
            quantity,
            variant,
            stock: product.product.stock
          }];
        } catch (error) {
          toast.error('Failed to add to cart');
          return;
        }
      }
      
      setCartItems(newCart);
      saveGuestCart(newCart);
      toast.success('Added to cart');
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.addToCart(productId, quantity, variant);
      setCartItems(response.items);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) {
      const newCart = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      setCartItems(newCart);
      saveGuestCart(newCart);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.updateQuantity(itemId, quantity);
      setCartItems(response.items);
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) {
      const newCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(newCart);
      saveGuestCart(newCart);
      toast.success('Removed from cart');
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.removeFromCart(itemId);
      setCartItems(response.items);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove from cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      saveGuestCart([]);
      return;
    }

    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const applyCoupon = async (code) => {
    try {
      const response = await cartService.applyCoupon(code);
      setCoupon(response.coupon);
      toast.success('Coupon applied successfully');
      return { success: true, discount: response.discount };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
      return { success: false };
    }
  };

  const removeCoupon = async () => {
    try {
      await cartService.removeCoupon();
      setCoupon(null);
      toast.success('Coupon removed');
    } catch (error) {
      toast.error('Failed to remove coupon');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getSubtotal = () => {
    return getCartTotal();
  };

  const getShippingCost = () => {
    const subtotal = getCartTotal();
    return subtotal >= 50 ? 0 : 5;
  };

  const getTax = () => {
    return getCartTotal() * 0.1; // 10% tax
  };

  const getTotal = () => {
    const subtotal = getCartTotal();
    const shipping = getShippingCost();
    const tax = getTax();
    let discount = 0;
    if (coupon) {
      discount = coupon.type === 'percentage' 
        ? (subtotal * coupon.value) / 100 
        : coupon.value;
    }
    return subtotal + shipping + tax - discount;
  };

  const mergeGuestCart = async () => {
    if (cartItems.length > 0 && isAuthenticated) {
      try {
        await cartService.mergeCart(cartItems);
        await fetchCart();
        localStorage.removeItem('guest_cart');
        toast.success('Cart synchronized');
      } catch (error) {
        console.error('Error merging cart:', error);
      }
    }
  };

  const value = {
    cartItems,
    loading,
    coupon,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getCartCount,
    getSubtotal,
    getShippingCost,
    getTax,
    getTotal,
    mergeGuestCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};