// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaTruck, FaShieldAlt, FaMoneyBillWave, FaHeadset } from 'react-icons/fa';
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
    { icon: FaTruck, title: 'Free Shipping', desc: 'On orders over KSh 50' },
    { icon: FaShieldAlt, title: 'Secure Payment', desc: '100% secure transactions' },
    { icon: FaMoneyBillWave, title: 'Money Back', desc: '30 days guarantee' },
    { icon: FaHeadset, title: '24/7 Support', desc: 'Dedicated support team' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white min-h-75 md:min-h-85 overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt={`Market Pulse hero ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                activeSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-linear-to-r from-black/35 via-primary/25 to-black/35" />
        </div>

        <div className="relative container mx-auto px-4 py-10 md:py-12">
          <div className="max-w-2xl mx-auto text-center bg-black/35 backdrop-blur-[1px] rounded-xl px-4 py-5 md:px-6 md:py-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
              {heroSlides[activeSlide].title}
            </h1>
            <p className="text-sm md:text-base mb-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
              {heroSlides[activeSlide].subtitle}
            </p>
            <Link to={heroSlides[activeSlide].cta} className="inline-block bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
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
                activeSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/60'
              }`}
              aria-label={`Go to hero slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <feature.icon className="text-4xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition"
              >
                <div className="text-3xl mb-2">{category.icon || '📦'}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

      {/* Business Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Business Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Brands', 'Wholesalers', 'Manufacturers', 'Retailers', 'Farmers', 'Small Business'].map((type) => (
              <div key={type} className="text-center p-4">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🏢</span>
                </div>
                <p className="font-semibold">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
