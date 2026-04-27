// src/contexts/SubscriptionContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock API – replace with real backend call
const fetchUserSubscription = async () => {
  // Simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Change to { active: true } after payment
      resolve({ active: false, planId: null, expiresAt: null });
    }, 500);
  });
};

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await fetchUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Failed to load subscription', error);
      setSubscription({ active: false });
    } finally {
      setLoading(false);
    }
  };

  const activateSubscription = async (planId, paymentDetails) => {
    // Replace with your actual API endpoint
    const response = await fetch('/api/subscription/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, paymentDetails }),
    });
    if (!response.ok) throw new Error('Activation failed');
    const data = await response.json();
    setSubscription({ active: true, planId: data.planId, expiresAt: data.expiresAt });
    return data;
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, activateSubscription, refresh: loadSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};