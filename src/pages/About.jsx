// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTruck,
  FaShieldAlt,
  FaMoneyBillWave,
  FaHeadset,
  FaStore,
  FaUsers,
  FaChartLine,
  FaHandshake,
} from 'react-icons/fa';
import aboutHeroImage from '../assets/images/360_F_273670292_Gcald9BW9G1oHm8fqEcIPfrghFbfXm9d.webp';
import businessImage from '../assets/images/240_F_736429436_NpVWpeNSbzAx35soBFulMc5N4MUO30NV.jpg';
import customerImage from '../assets/images/240_F_725819555_bH4Tv8G1KWOdwC60nwFHDZtGAmTHa2V8.jpg';

const About = () => {
  const trustFeatures = [
    { icon: FaTruck, title: 'Reliable Delivery', desc: 'Trackable shipping with clear order updates.' },
    { icon: FaShieldAlt, title: 'Secure Transactions', desc: 'Protected checkout and trusted payment flows.' },
    { icon: FaMoneyBillWave, title: 'Fair Pricing', desc: 'Direct seller pricing across multiple vendor types.' },
    { icon: FaHeadset, title: 'Platform Support', desc: 'Dedicated support for both buyers and sellers.' },
  ];

  const customerBenefits = [
    'Browse products from brands, wholesalers, retailers, farmers, and small businesses in one place.',
    'Compare options quickly by category, price, business type, and product details.',
    'Save favorites to wishlist, track orders in real time, and manage your purchases from one account.',
    'Shop confidently with transparent listings, ratings, and reliable checkout flow.',
  ];

  const businessBenefits = [
    'Create a storefront and publish products with pricing, stock, images, and variants.',
    'Reach customers actively searching across multiple categories and seller types.',
    'Manage orders, monitor product performance, and update inventory from your dashboard.',
    'Scale from small business to larger operations while keeping full control of your catalog.',
  ];

  return (
    <div className="bg-gray-50">
      <section className="relative h-75 md:h-90 overflow-hidden">
        <img src={aboutHeroImage} alt="Market Pulse platform overview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 to-primary-dark/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">About Market Pulse Platform</h1>
            <p className="text-white/95 text-base md:text-lg max-w-3xl">
              A unified marketplace built to help customers buy confidently and businesses grow faster.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-gray-700 mb-4">
              Market Pulse connects customers with a wide network of verified businesses, including brands,
              wholesalers, manufacturers, retailers, farmers, and small businesses. Our goal is to make online
              commerce more transparent, efficient, and inclusive.
            </p>
            <p className="text-gray-700">
              The platform is designed to deliver value to both sides of the marketplace: better discovery and
              convenience for customers, and stronger visibility and sales tools for businesses.
            </p>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <img src={customerImage} alt="Customers shopping on Market Pulse" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <FaUsers className="text-primary" />
                  <h3 className="text-xl font-semibold">For Customers</h3>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                  {customerBenefits.map((item, index) => (
                    <li key={index}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <img src={businessImage} alt="Businesses selling on Market Pulse" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <FaStore className="text-primary" />
                  <h3 className="text-xl font-semibold">For Businesses</h3>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                  {businessBenefits.map((item, index) => (
                    <li key={index}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-center mb-6">Why Market Pulse</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
                  <feature.icon className="text-4xl text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-primary/10 rounded-xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <FaHandshake className="text-primary text-2xl mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Trusted Marketplace</h4>
                  <p className="text-sm text-gray-700">Built for long-term customer-business relationships.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaChartLine className="text-primary text-2xl mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Business Growth Tools</h4>
                  <p className="text-sm text-gray-700">Practical dashboards and order management for sellers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaUsers className="text-primary text-2xl mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Customer-First Experience</h4>
                  <p className="text-sm text-gray-700">Easy product discovery, checkout, and post-purchase tracking.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-3">Explore Market Pulse</h2>
            <p className="text-gray-700 mb-6">
              Whether you are buying or selling, Market Pulse gives you the tools and visibility to succeed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/products" className="btn-primary inline-block">
                Start Shopping
              </Link>
              <Link to="/register?role=seller" className="btn-secondary inline-block">
                Start Selling
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
