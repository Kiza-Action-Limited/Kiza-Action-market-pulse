// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  FaShoppingCart, 
  FaUser, 
  FaBell, 
  FaBars, 
  FaTimes, 
  FaMapMarkerAlt,
  FaChevronDown
} from 'react-icons/fa';
import SearchBar from './SearchBar';
import DepartmentsMenu from './DepartmentMenu';
import marketPulseLogo from '../assets/Marketpulse-logo.png';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isSeller } = useAuth();
  const { getCartCount } = useCart();
  const { unreadCount } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && !e.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <>
      {/* Main Navbar - Amazon style */}
      <nav className="bg-primary text-white sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-3 md:py-4 flex-wrap md:flex-nowrap gap-2 sm:gap-3">
            <div className="flex items-center gap-3 shrink-0">
                  {/* Departments sidebar toggle beside logo */}
              <button
                onClick={() => setIsDepartmentsOpen(true)}
                className="bg-primary-dark text-white px-4 py-2.5 rounded-md hover:opacity-90 flex items-center gap-2 text-base"
                aria-label="Open departments sidebar"
              >
                <FaBars size={16} />
                <span className="hidden sm:inline">All</span>
              </button>
              {/* Logo */}
              <Link to="/" className="flex items-center hover:opacity-90 transition" aria-label="MarketPulse Home">
                <img
                  src={marketPulseLogo}
                  alt="Lango Market Pulse"
                  className="h-9 sm:h-10 md:h-12 w-auto max-w-[160px] sm:max-w-[210px] object-contain"
                />
                <span className="text-[#f3f2f2] font-bold text-base sm:text-lg">Market Pulse</span>
              </Link>

            
            </div>

            {/* Delivery Location */}
            <div className="hidden md:flex items-center text-base mr-4 hover:opacity-80 cursor-pointer">
              <FaMapMarkerAlt className="mr-1" />
              <div>
                <div className="font-semibold text-base">Kenya</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="order-3 w-full md:order-none md:flex-1 md:max-w-3xl md:mx-4 relative">
              <SearchBar />
            </div>

            {/* Right side: Account, Orders, Cart */}
            <div className="ml-auto flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
              {/* Notifications */}
              <div className="relative hidden sm:block">
                <button
                  className="relative hover:text-primary-light transition"
                >
                  <FaBell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Account & Lists */}
              <div className="relative user-menu hidden sm:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex flex-col items-start text-sm md:text-base hover:opacity-80"
                >
                  <span className="text-xs md:text-sm">Hello, {user?.name || 'sign in'}</span>
                  <span className="font-semibold flex items-center gap-1">
                    Account & Lists <FaChevronDown size={12} />
                  </span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-dark rounded-lg shadow-lg py-2 z-20">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                        {isSeller && (
                          <Link
                            to="/seller"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Seller Dashboard
                          </Link>
                        )}
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign in
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          New customer? Start here.
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Returns & Orders */}
              <Link to="/orders" className="hidden lg:flex flex-col items-start text-sm md:text-base hover:opacity-80">
                <span className="text-xs md:text-sm">Returns</span>
                <span className="font-semibold">& Orders</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative hover:opacity-80 flex items-center text-base">
                <FaShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-yellow-400 text-dark text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="ml-2 font-semibold hidden sm:inline">Cart</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

        </div>
      </nav>

      {/* Departments Sidebar */}
      {isDepartmentsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[70]"
            onClick={() => setIsDepartmentsOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl border-r z-[80]">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-bold text-dark">Departments</h2>
              <button
                onClick={() => setIsDepartmentsOpen(false)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close departments sidebar"
              >
                <FaTimes />
              </button>
            </div>
            <div className="h-[calc(100%-57px)] overflow-y-auto">
              <DepartmentsMenu onClose={() => setIsDepartmentsOpen(false)} />
            </div>
          </aside>
        </>
      )}

      {/* Existing Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-primary w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-3">
              <Link to="/products" className="block text-white" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              <Link to="/categories" className="block text-white" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>
              <Link to="/cart" className="block text-white" onClick={() => setIsMenuOpen(false)}>
                Cart ({cartCount})
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block text-white" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                  <Link to="/orders" className="block text-white" onClick={() => setIsMenuOpen(false)}>Orders</Link>
                  <Link to="/wishlist" className="block text-white" onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
                  {isSeller && (
                    <Link to="/seller" className="block text-white" onClick={() => setIsMenuOpen(false)}>Seller Dashboard</Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin" className="block text-white" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="block text-left text-white w-full">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-white" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="block text-white" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
