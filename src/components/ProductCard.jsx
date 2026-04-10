// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product.id, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 bg-gray-200">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-dark hover:text-primary mb-1 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="text-sm text-gray-500 mb-1">({product.reviews?.length || 0})</div>

        <div className="mb-1">
          <span className="text-2xl font-bold text-primary">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through ml-1">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>

        <div className="text-xs text-gray-500 mb-3 lowercase">{product.seller?.businessType}</div>
        
        {product.stock > 0 ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition flex items-center justify-center space-x-2"
          >
            <FaShoppingCart />
            <span>Add to Cart</span>
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
