import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHeart, FaRegCommentDots } from 'react-icons/fa';

const SupplierCard = ({ supplier }) => {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-[38%]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-[#111827] text-lg">{supplier.name}</h3>
              <p className="text-xs text-[#6B7280] mt-1">
                <span className="inline-flex items-center gap-1 text-[#2563EB] font-semibold mr-2">
                  <FaCheckCircle size={11} />
                  Verified
                </span>
                {supplier.years} yr | {supplier.staffRange} | {supplier.annualSales}
              </p>
              {supplier.aiPrediction && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#F97316]/10 text-[#F97316] font-semibold">
                    AI Match {supplier.aiPrediction.confidence}%
                  </span>
                  <span className="text-xs text-[#4B5563]">{supplier.aiPrediction.trend}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-[#374151]">
            <p>
              Rating and reviews
              <br />
              <span className="font-semibold text-[#111827]">{supplier.rating}/5</span> ({supplier.reviews} reviews)
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-[#111827] mb-2">Factory capabilities</p>
            <ul className="space-y-1">
              {supplier.capabilities.map((capability) => (
                <li key={capability} className="text-sm text-[#374151]">
                  - {capability}
                </li>
              ))}
            </ul>
            {!!supplier.aiPrediction?.tags?.length && (
              <div className="flex flex-wrap gap-1 mt-3">
                {supplier.aiPrediction.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[#EEF2FF] text-[#3730A3]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {(supplier.moqOptions?.length > 0 || supplier.farmerOptional) && (
            <div className="mt-4 p-3 rounded-lg border border-gray-200 bg-[#F9FAFB]">
              <p className="text-sm font-medium text-[#111827] mb-2">Order terms</p>
              {supplier.moqOptions?.length > 0 && (
                <div className="space-y-1">
                  {supplier.moqOptions.map((option) => (
                    <p key={`${supplier.id}-${option.label}`} className="text-sm text-[#374151]">
                      <span className="font-semibold text-[#111827]">{option.label}:</span> {option.value}
                    </p>
                  ))}
                </div>
              )}
              {supplier.farmerOptional && (
                <p className="text-xs mt-2 inline-flex px-2 py-1 rounded-full bg-[#16A34A]/10 text-[#166534] font-semibold">
                  Farmer orders are optional
                </p>
              )}
            </div>
          )}

          {supplier.premiumProfile && (
            <div className="mt-4 p-3 rounded-lg border border-[#16A34A]/30 bg-[#16A34A]/5">
              <p className="text-xs font-semibold text-[#166534] uppercase tracking-wide mb-2">Premium Seller Verification</p>
              <p className="text-sm text-[#1F2937]">
                <span className="font-semibold">Registered Name:</span> {supplier.premiumProfile.governmentBusinessName}
              </p>
              <p className="text-sm text-[#1F2937]">
                <span className="font-semibold">Business Email:</span> {supplier.premiumProfile.businessEmail}
              </p>
              {!!supplier.premiumProfile.businessUrls?.length && (
                <div className="mt-1">
                  <p className="text-sm font-semibold text-[#1F2937]">Valid URLs:</p>
                  <ul className="mt-1 space-y-1">
                    {supplier.premiumProfile.businessUrls.slice(0, 3).map((url) => (
                      <li key={url}>
                        <a href={url} target="_blank" rel="noreferrer" className="text-xs text-[#2563EB] hover:underline break-all">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:flex-1">
          <div className="flex items-center justify-end gap-2 mb-3">
            <button className="w-9 h-9 rounded-full border border-gray-300 text-gray-500 hover:text-[#F97316] hover:border-[#F97316] inline-flex items-center justify-center">
              <FaHeart size={14} />
            </button>
            <Link
              to={`/businesses/${supplier.id}`}
              className="px-4 py-2 rounded-full border-2 border-[#111827] text-sm font-semibold hover:bg-gray-50"
            >
              View profile
            </Link>
            <Link
              to={`/contact?type=technical&subject=${encodeURIComponent(`Chat request: ${supplier.name}`)}`}
              className="px-4 py-2 rounded-full border-2 border-[#111827] text-sm font-semibold hover:bg-gray-50"
            >
              Chat now
            </Link>
            <Link
              to={`/contact?type=partnership&subject=${encodeURIComponent(`Supplier inquiry: ${supplier.name}`)}`}
              className="px-4 py-2 rounded-full border-2 border-[#111827] text-sm font-semibold hover:bg-gray-50"
            >
              Contact us
            </Link>
          </div>

          <div className="mt-1 flex gap-3">
            <div className="w-52 shrink-0 rounded-lg bg-[#111827] overflow-hidden relative h-44">
              {supplier.coverImage ? (
                <img src={supplier.coverImage} alt={`${supplier.name} cover`} className="w-full h-full object-cover opacity-85" />
              ) : (
                <div className="w-full h-full bg-[#1F2937]" />
              )}
              <div className="absolute bottom-2 right-2 text-xs text-white bg-black/45 px-2 py-1 rounded-full inline-flex items-center gap-1">
                <FaRegCommentDots size={10} />
                {supplier.businessType}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-[#111827]">Products</p>
                <span className="text-xs text-[#6B7280]">{supplier.products.length} items</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {supplier.products.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="rounded-lg bg-gray-50 p-2 block hover:ring-2 hover:ring-[#FB923C]/40"
                  >
                    <img src={product.image} alt={product.name} className="w-full h-20 object-cover rounded-md" />
                    <p className="text-xs font-semibold text-[#111827] mt-2 line-clamp-1">{product.name}</p>
                    <p className="text-sm font-semibold text-[#F97316]">{product.priceText}</p>
                    <p className="text-[11px] text-[#6B7280] line-clamp-1">{product.minOrder}</p>
                  </Link>
                ))}
              </div>
              {supplier.products.length > 6 && (
                <Link
                  to={`/businesses/${supplier.id}`}
                  className="inline-block mt-2 text-xs text-[#F97316] hover:underline"
                >
                  View all products in profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SupplierCard;
