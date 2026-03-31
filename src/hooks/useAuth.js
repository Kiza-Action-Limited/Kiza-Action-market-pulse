// src/hooks/useAuth.js
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();
  
  const hasRole = (role) => {
    return auth.user?.role === role;
  };
  
  const hasAnyRole = (roles) => {
    return roles.includes(auth.user?.role);
  };
  
  const isSeller = () => {
    return auth.user?.role === 'seller' || auth.user?.role === 'admin';
  };
  
  const isAdmin = () => {
    return auth.user?.role === 'admin';
  };
  
  const isBuyer = () => {
    return auth.user?.role === 'buyer';
  };
  
  const getBusinessType = () => {
    return auth.user?.businessType;
  };
  
  return {
    ...auth,
    hasRole,
    hasAnyRole,
    isSeller,
    isAdmin,
    isBuyer,
    getBusinessType
  };
};