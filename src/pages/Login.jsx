import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaBrain, FaArrowRight } from 'react-icons/fa';
import marketPulseLogo from '../assets/Marketpulse-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-[#F9FAFB] to-[#E5E7EB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-[#F97316]/15">
          <img
            src={marketPulseLogo}
            alt="Lango Market Pulse"
            className="w-full h-auto max-h-105 object-contain mx-auto"
          />
          <p className="mt-4 text-sm text-[#6B7280] text-center">
            Smart trade connections and intelligence for every business.
          </p>
        </div>

        <div className="w-full max-w-md lg:max-w-none mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-[#F97316]">Welcome Back</h2>
            <p className="mt-2 text-sm text-[#6B7280] italic">Lango Lako la Biashara Smart</p>
            <p className="mt-1 text-xs text-[#6B7280]">Sign in to access your Trade and Intelligence OS</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-lg shadow-sm space-y-3">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-[#6B7280] text-[#111827] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] text-sm" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-[#6B7280] text-[#111827] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#F97316] focus:ring-[#F97316] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#6B7280]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-[#FB923C] hover:text-[#F97316] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-[#F97316] hover:bg-[#F97316]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <FaArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-linear-to-r from-[#FB923C]/5 to-[#F97316]/5 rounded-lg border border-[#FB923C]/20">
            <div className="flex items-center gap-2 mb-2">
              <FaBrain className="text-[#FB923C] text-sm" />
              <span className="text-xs font-semibold text-[#FB923C] uppercase tracking-wide">AI Intelligence</span>
            </div>
            <p className="text-xs text-[#6B7280]">
              Your Trade and Intelligence OS with personalized recommendations and market insights.
            </p>
          </div>

          <p className="text-center text-sm text-[#6B7280]">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-[#F97316] hover:text-[#F97316]/80 transition-colors">
              Create new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;