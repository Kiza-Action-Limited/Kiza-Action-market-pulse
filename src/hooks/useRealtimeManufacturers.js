import { useCallback, useEffect, useMemo, useState } from 'react';
import { mockAdminProducts, mockAdminUsers, mockCategories } from '../data/mockData';
import { mockBusinessSuppliers } from '../data/mockBusinessNetwork';
import { manufacturerService } from '../services/manufacturerService';
import { isMockDataEnabled } from '../utils/mockDataControl';
import { buildSupplierCards } from '../utils/manufacturerMapper';
import { getPremiumProfiles } from '../utils/premiumSellerProfile';
import { mergeSupplierPredictions, predictSuppliersLocal } from '../utils/supplierPrediction';

const POLL_MS = 45000;
const withOrderTerms = (supplier) => {
  const t = String(supplier?.businessType || '').toLowerCase();
  const moqOptions =
    t === 'manufacturer' || t === 'wholesaler'
      ? [
          { label: 'MQQ1', value: '10 - 2,999 pieces' },
          { label: 'MQQ2', value: '3,000+ pieces' },
        ]
      : [];
  return {
    ...supplier,
    moqOptions: supplier.moqOptions || moqOptions,
    farmerOptional: supplier.farmerOptional || t === 'farmer',
  };
};

export const useRealtimeManufacturers = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sourceMode, setSourceMode] = useState('api');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [premiumProfiles, setPremiumProfiles] = useState([]);
  const [headerConfig, setHeaderConfig] = useState(null);

  const loadData = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await manufacturerService.getMarketplaceData();
      setCategories(data.categories);
      setProducts(data.products);
      setUsers(mockAdminUsers);
      setPremiumProfiles(getPremiumProfiles());
      setSourceMode('api');
      setLastSyncedAt(new Date().toISOString());
      try {
        const header = await manufacturerService.getHubHeaderConfig();
        setHeaderConfig(header);
      } catch (headerError) {
        setHeaderConfig(null);
      }
    } catch (error) {
      if (isMockDataEnabled()) {
        setCategories(mockCategories);
        setProducts(mockAdminProducts);
        setUsers(mockAdminUsers);
        setPremiumProfiles(getPremiumProfiles());
        setSourceMode('mock');
        setLastSyncedAt(new Date().toISOString());
        setHeaderConfig(null);
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadData(true);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [loadData]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'marketpulse_premium_seller_profiles_v1') {
        setPremiumProfiles(getPremiumProfiles());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const baseSuppliers = useMemo(() => buildSupplierCards(products, users, premiumProfiles), [products, users, premiumProfiles]);
  const mergedSuppliers = useMemo(() => {
    if (!isMockDataEnabled()) return baseSuppliers;
    if (!baseSuppliers.length || baseSuppliers.length < 8) {
      const existingNames = new Set(baseSuppliers.map((supplier) => supplier.name.toLowerCase()));
      const additional = mockBusinessSuppliers.filter((supplier) => !existingNames.has(supplier.name.toLowerCase()));
      return [...baseSuppliers, ...additional].map(withOrderTerms);
    }
    return baseSuppliers.map(withOrderTerms);
  }, [baseSuppliers]);

  const getSuppliersWithPrediction = useCallback(
    async (query = '') => {
      try {
        const payload = {
          query,
          suppliers: mergedSuppliers.map((supplier) => ({
            id: supplier.id,
            name: supplier.name,
            rating: supplier.rating,
            reviews: supplier.reviews,
            capabilities: supplier.capabilities,
            businessType: supplier.businessType,
          })),
        };
        const result = await manufacturerService.predictSuppliers(payload);
        const remotePredictions = Array.isArray(result?.predictions) ? result.predictions : [];
        if (remotePredictions.length) {
          return mergeSupplierPredictions(mergedSuppliers, remotePredictions);
        }
      } catch (error) {
        // Fall back to local predictor.
      }
      const localPredictions = predictSuppliersLocal(mergedSuppliers, query);
      return mergeSupplierPredictions(mergedSuppliers, localPredictions);
    },
    [mergedSuppliers]
  );

  const searchSuppliersRealtime = useCallback(
    async ({ query = '', category = '', businessType = '' } = {}) => {
      const response = await manufacturerService.searchBusinesses({ query, category, businessType });

      const directSuppliers = Array.isArray(response?.suppliers) ? response.suppliers : null;
      const candidateProducts =
        Array.isArray(response?.products) ? response.products : Array.isArray(response?.data?.products) ? response.data.products : null;

      if (directSuppliers && directSuppliers.length) {
        return directSuppliers;
      }

      if (candidateProducts && candidateProducts.length) {
        return buildSupplierCards(candidateProducts, users, premiumProfiles);
      }

      return [];
    },
    [users, premiumProfiles]
  );

  const resolvedHeaderConfig = useMemo(() => {
    if (headerConfig) return headerConfig;

    return {
      topLinks: ['All categories', 'Verified businesses', 'Order protections'],
      countryLabel: 'Kenya',
      modeTabs: ['AI Mode', 'Products', 'Businesses', 'Worldwide'],
      searchPlaceholder: 'Search suppliers, products, capabilities...',
      hints: ['Image Search', 'Search with File'],
    };
  }, [headerConfig]);

  return {
    categories,
    products,
    users,
    loading,
    refreshing,
    sourceMode,
    lastSyncedAt,
    headerConfig: resolvedHeaderConfig,
    baseSuppliers: mergedSuppliers,
    reload: () => loadData(true),
    getSuppliersWithPrediction,
    searchSuppliersRealtime,
  };
};
