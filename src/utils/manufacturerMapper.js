import { formatCurrency } from './formatters';

const toTitle = (value = '') =>
  String(value)
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const buildCategoryTabs = (categories = []) => {
  const base = [{ id: 'all', name: 'All categories' }];
  return [
    ...base,
    ...categories.map((category) => ({
      id: category.id,
      name: category.name,
    })),
  ];
};

const normalize = (value = '') => String(value).trim().toLowerCase();
const isMoqBusiness = (type = '') => {
  const t = normalize(type);
  return t === 'manufacturer' || t === 'wholesaler';
};

export const buildSupplierCards = (products = [], users = [], premiumProfiles = []) => {
  const sellerUsers = users.filter((user) => user.role === 'seller');
  const bySeller = products.reduce((acc, product) => {
    const sellerName = product?.seller?.businessName || 'Unknown Supplier';
    if (!acc[sellerName]) acc[sellerName] = [];
    acc[sellerName].push(product);
    return acc;
  }, {});

  return Object.entries(bySeller).map(([sellerName, sellerProducts], index) => {
    const matchedUser =
      sellerUsers.find((user) => user.name === sellerName || user.businessType === sellerProducts[0]?.seller?.businessType) ||
      null;
    const first = sellerProducts[0];
    const avgRating =
      sellerProducts.reduce((sum, product) => sum + (Number(product.rating) || 0), 0) /
      Math.max(1, sellerProducts.length);
    const low = Math.min(...sellerProducts.map((product) => Number(product.price) || 0));
    const high = Math.max(...sellerProducts.map((product) => Number(product.price) || 0));

    const capabilityPool = [
      'Low MOQ for customization',
      'Sample-based customization',
      'Quality management certified',
      'Minor customization',
      'Response time ≤ 1h',
      'On-time delivery 98%+',
      'ODM service available',
      'OEM for known brands',
    ];

    const startIdx = index % capabilityPool.length;
    const capabilities = [
      capabilityPool[startIdx],
      capabilityPool[(startIdx + 2) % capabilityPool.length],
      capabilityPool[(startIdx + 4) % capabilityPool.length],
      capabilityPool[(startIdx + 6) % capabilityPool.length],
    ];

    const premiumProfile =
      premiumProfiles.find((profile) => normalize(profile.storefrontName) === normalize(sellerName)) ||
      premiumProfiles.find((profile) => normalize(profile.governmentBusinessName) === normalize(sellerName)) ||
      null;

    return {
      id: `supplier-${index + 1}`,
      name: sellerName,
      categoryId: first?.categoryId || 'all',
      verified: true,
      years: 1 + (index % 12),
      staffRange: `${10 + index * 8}+ staff`,
      annualSales: `${formatCurrency((high + low) * 1200, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}+`,
      rating: Number.isFinite(avgRating) ? avgRating.toFixed(1) : '0.0',
      reviews: sellerProducts.reduce((sum, product) => sum + (product.reviews?.length || 0), 0),
      businessType: toTitle(first?.seller?.businessType || matchedUser?.businessType || 'supplier'),
      capabilities,
      products: sellerProducts.slice(0, 4).map((product, i) => ({
        id: product.id,
        name: product.name,
        image: product.images?.[0],
        priceText: `${formatCurrency(product.price, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        minOrder: `Min. order: ${10 + i * 5} pieces`,
      })),
      coverImage: sellerProducts[0]?.images?.[0],
      createdAt: matchedUser?.createdAt || null,
      premiumProfile,
      moqOptions: isMoqBusiness(first?.seller?.businessType)
        ? [
            { label: 'MQQ1', value: '10 - 2,999 pieces', pricce: ''},
            { label: 'MQQ2', value: '3,000+ pieces', pricce: ''},
          ]
        : [],
      farmerOptional: normalize(first?.seller?.businessType) === 'farmer',
    };
  });
};

export const buildCapabilityChips = (suppliers = []) => {
  const seen = new Set();
  const chips = [];
  suppliers.forEach((supplier) => {
    supplier.capabilities.forEach((capability) => {
      if (!seen.has(capability) && chips.length < 6) {
        seen.add(capability);
        chips.push(capability);
      }
    });
  });
  return chips;
};
