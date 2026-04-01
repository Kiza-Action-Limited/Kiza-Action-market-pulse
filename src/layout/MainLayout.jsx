// src/layouts/MainLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import marketPulseLogo from '../assets/Marketpulse-logo.png';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthPage ? (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
            <div className="h-16 sm:h-18 flex items-center">
              <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition" aria-label="MarketPulse Home">
                <img
                  src={marketPulseLogo}
                  alt="Lango Market Pulse"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
                <span className="text-[#F97316] font-bold text-base sm:text-lg">Lango Market Pulse</span>
              </Link>
            </div>
          </div>
        </nav>
      ) : (
        <Navbar />
      )}
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout;
