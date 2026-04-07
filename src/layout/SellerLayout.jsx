// src/layouts/SellerLayout.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaPlus, FaBox, FaShoppingCart, FaCrown } from 'react-icons/fa';

const SellerLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/seller', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/seller/add-product', label: 'Add Product', icon: FaPlus },
    { path: '/seller/products', label: 'My Products', icon: FaBox },
    { path: '/seller/orders', label: 'Orders', icon: FaShoppingCart },
    { path: '/subscription-plans', label: 'Subscription', icon: FaCrown },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white">
        <div className="p-6">
          <h2 className="text-xl font-bold">Seller Panel</h2>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 hover:bg-primary-dark transition ${isActive ? 'bg-primary-dark' : ''}`}
              >
                <Icon className="mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayout;
