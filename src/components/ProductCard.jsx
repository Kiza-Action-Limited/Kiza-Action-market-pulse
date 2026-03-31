// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
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
          <h3 className="text-lg font-semibold text-dark hover:text-primary mb-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                size={14}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviews?.length || 0})</span>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">{product.seller?.businessType}</span>
        </div>
        
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
