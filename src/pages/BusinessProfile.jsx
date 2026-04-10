import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaGlobe, FaPhoneAlt } from 'react-icons/fa';
import { useRealtimeManufacturers } from '../hooks/useRealtimeManufacturers';

const BusinessProfile = () => {
  const { businessId } = useParams();
  const { baseSuppliers, loading } = useRealtimeManufacturers();

  const business = useMemo(
    () => baseSuppliers.find((item) => item.id === businessId) || null,
    [baseSuppliers, businessId]
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-[#111827]">Business not found</h1>
        <Link to="/businesses" className="text-[#F97316] hover:underline mt-2 inline-block">
          Back to business directory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-4">
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-[#111827]">{business.name}</h1>
          <p className="text-[#6B7280] mt-1">
            {business.businessType} | Verified | {business.years} years | {business.staffRange}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-[#374151]">
            <span className="inline-flex items-center gap-1">
              <FaCheckCircle className="text-[#16A34A]" />
              Rating {business.rating}/5 ({business.reviews} reviews)
            </span>
            <span>Annual sales: {business.annualSales}</span>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#111827] mb-3">Business profile</h2>
          <ul className="space-y-2 text-sm text-[#374151]">
            {business.capabilities.map((capability) => (
              <li key={capability}>- {capability}</li>
            ))}
          </ul>

          {(business.moqOptions?.length > 0 || business.farmerOptional) && (
            <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-[#F9FAFB]">
              <h3 className="font-semibold text-[#111827] mb-2">Order terms</h3>
              {business.moqOptions?.length > 0 && (
                <div className="space-y-1">
                  {business.moqOptions.map((option) => (
                    <p key={`${business.id}-${option.label}`} className="text-sm text-[#374151]">
                      <span className="font-semibold text-[#111827]">{option.label}:</span> {option.value}
                    </p>
                  ))}
                </div>
              )}
              {business.farmerOptional && (
                <p className="text-xs mt-2 inline-flex px-2 py-1 rounded-full bg-[#16A34A]/10 text-[#166534] font-semibold">
                  Farmer orders are optional
                </p>
              )}
            </div>
          )}

          {business.premiumProfile && (
            <div className="mt-4 p-4 rounded-lg border border-[#16A34A]/30 bg-[#16A34A]/5">
              <h3 className="font-semibold text-[#166534] mb-2">Premium verified information</h3>
              <p className="text-sm text-[#1F2937]">Government Name: {business.premiumProfile.governmentBusinessName}</p>
              <p className="text-sm text-[#1F2937]">Business Email: {business.premiumProfile.businessEmail}</p>
              {!!business.premiumProfile.businessUrls?.length && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-[#1F2937]">Valid URLs:</p>
                  <ul className="space-y-1 mt-1">
                    {business.premiumProfile.businessUrls.map((url) => (
                      <li key={url}>
                        <a href={url} target="_blank" rel="noreferrer" className="text-xs text-[#2563EB] hover:underline break-all inline-flex items-center gap-1">
                          <FaGlobe size={10} />
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#111827]">Products</h2>
            <Link to={`/contact?type=partnership&subject=${encodeURIComponent(`Business inquiry: ${business.name}`)}`} className="px-4 py-2 rounded-lg border-2 border-[#111827] text-sm font-semibold hover:bg-gray-50">
              Contact business
            </Link>
          </div>
          <p className="text-xs text-[#6B7280] mb-3">Total mock products in this business: {business.products.length}</p>
          <div className="flex gap-3">
            <div className="w-56 shrink-0 rounded-lg overflow-hidden bg-[#111827] relative h-48">
              {business.coverImage ? (
                <img src={business.coverImage} alt={`${business.name} profile`} className="w-full h-full object-cover opacity-85" />
              ) : (
                <div className="w-full h-full bg-[#1F2937]" />
              )}
              <div className="absolute bottom-2 right-2 text-xs text-white bg-black/45 px-2 py-1 rounded-full">
                {business.businessType}
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {business.products.map((product) => (
                  <Link to={`/products/${product.id}`} key={product.id} className="rounded-lg border border-gray-200 p-2 bg-gray-50 hover:ring-2 hover:ring-[#FB923C]/40 w-40 shrink-0">
                    <img src={product.image} alt={product.name} className="h-24 w-full object-cover rounded-md" />
                    <p className="text-sm font-semibold text-[#111827] mt-2">{product.priceText}</p>
                    <p className="text-xs text-[#6B7280]">{product.minOrder}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#111827] mb-3">Business contacts</h2>
          <div className="space-y-2 text-sm text-[#374151]">
            <p className="inline-flex items-center gap-2">
              <FaEnvelope className="text-[#F97316]" />
              {business.premiumProfile?.businessEmail || 'business@marketpulse.co.ke'}
            </p>
            <p className="inline-flex items-center gap-2">
              <FaPhoneAlt className="text-[#F97316]" />
              +254 700 000000
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BusinessProfile;
