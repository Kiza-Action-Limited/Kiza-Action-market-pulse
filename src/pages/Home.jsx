// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaTruck, FaShieldAlt, FaMoneyBillWave, FaHeadset, FaBrain, FaChartLine, FaBell, FaStore } from 'react-icons/fa';
import { mockFeaturedProducts, mockCategories } from '../data/mockData';
import { isMockDataEnabled } from '../utils/mockDataControl';
import slideImage1 from '../assets/images/240_F_1204665252_ZX7G4szbgbzeLf9M2OSYKu32GfBT6qWC.jpg';
import slideImage2 from '../assets/images/240_F_1671818644_Ddbso43PyJfSVubnXaL7rmXfRww6Dkjz.jpg';
import slideImage3 from '../assets/images/240_F_1693527828_L7tgoYmYIn1hayBctZQBpBy1gMLpK4pQ.jpg';
import slideImage4 from '../assets/images/240_F_1727631229_Jvja9SE3o82p1C7Io8pDek06qHddbyp8.jpg';
import slideImage5 from '../assets/images/240_F_1770944832_gErqIw7TSdo3GuKK7fnZ8VyExTFEynyJ.jpg';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      image: slideImage1,
      title: 'Wireless Audio Deals',
      subtitle: 'Discover premium headphones and speakers at unbeatable prices.',
      cta: '/products?category=electronics',
      ctaLabel: 'Shop Electronics',
    },
    {
      image: slideImage2,
      title: 'Fresh Fashion Picks',
      subtitle: 'From streetwear to essentials, update your style today.',
      cta: '/products?category=fashion',
      ctaLabel: 'Shop Fashion',
    },
    {
      image: slideImage3,
      title: 'Smart Devices for Home',
      subtitle: 'Upgrade your home and kitchen with practical smart products.',
      cta: '/products?category=home',
      ctaLabel: 'Shop Home',
    },
    {
      image: slideImage4,
      title: 'Beauty and Wellness',
      subtitle: 'Care products curated for everyday confidence and comfort.',
      cta: '/products?category=beauty',
      ctaLabel: 'Shop Beauty',
    },
    {
      image: slideImage5,
      title: 'Sports and Active Gear',
      subtitle: 'Train better with top-rated fitness and sports essentials.',
      cta: '/products?category=sports',
      ctaLabel: 'Shop Sports',
    },
  ];

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const fetchHomeData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products/featured'),
        axios.get('http://localhost:5000/api/categories')
      ]);
      setFeaturedProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error fetching home data:', error);
      if (isMockDataEnabled()) {
        setFeaturedProducts(mockFeaturedProducts);
        setCategories(mockCategories);
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: FaTruck, title: 'Free Shipping', desc: 'On orders over KSh 50', color: '#F97316' },
    { icon: FaShieldAlt, title: 'Secure Payment', desc: '100% secure transactions', color: '#FB923C' },
    { icon: FaMoneyBillWave, title: 'Money Back', desc: '30 days guarantee', color: '#16A34A' },
    { icon: FaHeadset, title: '24/7 Support', desc: 'Dedicated support team', color: '#F97316' }
  ];

  const intelligenceFeatures = [
    { icon: FaBrain, title: 'AI Market Insights', desc: 'Smart predictions and trend analysis', color: '#FB923C' },
    { icon: FaChartLine, title: 'Profit Indicators', desc: 'Real-time growth tracking', color: '#16A34A' },
    { icon: FaBell, title: 'Smart Alerts', desc: 'Instant notifications on opportunities', color: '#F97316' },
  ];

  const businessTypes = [
    { name: 'Brands', icon: '🏢', color: '#F97316' },
    { name: 'Wholesalers', icon: '📦', color: '#FB923C' },
    { name: 'Manufacturers', icon: '🏭', color: '#F97316' },
    { name: 'Retailers', icon: '🏪', color: '#16A34A' },
    { name: 'Farmers', icon: '🌾', color: '#F97316' },
    { name: 'Small Business', icon: '🚀', color: '#FB923C' },
  ];

  return (
    <div className="bg-[#F9FAFB]">
      {/* Hero Section with Lango MarketPulse branding */}
      <section className="relative text-white min-h-75 md:min-h-85 overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt={`Lango MarketPulse hero ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                activeSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/40 via-[#FB923C]/30 to-[#F97316]/40" />
        </div>

        <div className="relative container mx-auto px-4 py-10 md:py-12">
          <div className="max-w-2xl mx-auto text-center bg-[#F97316]/30 backdrop-blur-md rounded-xl px-4 py-5 md:px-6 md:py-6 border border-white/20">
            <div className="mb-2">
              <span className="text-xs md:text-sm font-semibold tracking-wide text-[#F97316]">Lango Lako la Biashara Smart</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
              {heroSlides[activeSlide].title}
            </h1>
            <p className="text-sm md:text-base mb-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
              {heroSlides[activeSlide].subtitle}
            </p>
            <Link 
              to={heroSlides[activeSlide].cta} 
              className="inline-block bg-[#F97316] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#F97316]/90 transition shadow-lg"
            >
              {heroSlides[activeSlide].ctaLabel}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeSlide === index ? 'w-8 bg-[#F97316]' : 'w-2.5 bg-white/60'
              }`}
              aria-label={`Go to hero slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Lango MarketPulse Intelligence Banner */}
      <section className="py-8 bg-gradient-to-r from-[#F97316] to-[#FB923C]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/90 text-sm md:text-base font-medium">
            ⚡ <span className="font-bold">Lango MarketPulse Trade & Intelligence OS</span> — 
            AI-powered insights meet seamless commerce. <span className="text-[#F97316]">Lango Lako la Biashara Smart</span>
          </p>
        </div>
      </section>

      {/* Features with new brand colors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#F97316] mb-2">Why Choose Lango MarketPulse</h2>
            <p className="text-[#6B7280]">Your trusted gateway to smart business and intelligent commerce</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-[#F9FAFB] hover:shadow-lg transition-shadow">
                <feature.icon className="text-4xl mx-auto mb-4" style={{ color: feature.color }} />
                <h3 className="text-xl font-semibold mb-2 text-[#111827]">{feature.title}</h3>
                <p className="text-[#6B7280]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Intelligence Section */}
      <section className="py-16 bg-gradient-to-br from-[#FB923C]/5 to-[#F97316]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 bg-[#FB923C]/10 rounded-full mb-3">
              <span className="text-[#FB923C] text-sm font-semibold">Intelligence Layer</span>
            </div>
            <h2 className="text-3xl font-bold text-[#F97316] mb-2">AI-Powered Smart Commerce</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Powered by predictive analytics and real-time insights to help you make smarter decisions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {intelligenceFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md border-t-4" style={{ borderTopColor: feature.color }}>
                <feature.icon className="text-4xl mx-auto mb-4" style={{ color: feature.color }} />
                <h3 className="text-xl font-semibold mb-2 text-[#111827]">{feature.title}</h3>
                <p className="text-[#6B7280]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories with updated styling */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#F97316]">Shop by Category</h2>
          <p className="text-center text-[#6B7280] mb-12">Discover products across diverse categories from verified sellers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category, idx) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-3xl mb-2">{category.icon || '📦'}</div>
                <h3 className="font-semibold text-[#111827]">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#F97316]">Featured Products</h2>
          <p className="text-center text-[#6B7280] mb-12">Curated selections from trusted sellers across Kenya</p>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Business Partners with new branding */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaStore className="text-[#F97316] text-2xl" />
              <h2 className="text-3xl font-bold text-[#F97316]">Our Business Partners</h2>
            </div>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              From local farmers to established brands — we empower all businesses to grow
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {businessTypes.map((type, index) => (
              <div key={type.name} className="text-center p-4 group">
                <div 
                  className="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3 transition-all group-hover:scale-105"
                  style={{ backgroundColor: `${type.color}15` }}
                >
                  <span className="text-3xl">{type.icon}</span>
                </div>
                <p className="font-semibold text-[#111827]">{type.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#F97316] to-[#FB923C]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Start Your Journey?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of smart businesses and customers on Lango MarketPulse — 
            <span className="font-semibold italic"> Lango Lako la Biashara Smart</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/products" 
              className="px-6 py-3 bg-[#F97316] text-white font-medium rounded-lg hover:bg-[#F97316]/90 transition-colors shadow-lg"
            >
              Start Shopping
            </Link>
            <Link 
              to="/register?role=seller" 
              className="px-6 py-3 bg-white text-[#F97316] font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;