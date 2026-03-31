// src/pages/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatters';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b py-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <Link to={`/products/${item.productId}`} className="text-lg font-semibold hover:text-primary">
                  {item.name}
                </Link>
                <p className="text-gray-500 text-sm">{item.seller?.businessName}</p>
                <p className="text-primary font-semibold mt-1">{formatCurrency(item.price)}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 border rounded-l-lg hover:bg-gray-100"
                  >
                    <FaMinus size={12} className="mx-auto" />
                  </button>
                  <span className="w-12 text-center border-t border-b py-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                    className="w-8 h-8 border rounded-r-lg hover:bg-gray-100"
                  >
                    <FaPlus size={12} className="mx-auto" />
                  </button>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="text-right">
                <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(getCartTotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{getCartTotal() >= 50 ? 'Free' : formatCurrency(5)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(getCartTotal() + (getCartTotal() >= 50 ? 0 : 5))}</span>
            </div>
          </div>
          
          <button
            onClick={handleCheckout}
            className="w-full btn-primary py-3"
          >
            Proceed to Checkout
          </button>
          
          <Link to="/products" className="block text-center text-primary mt-4 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
