// src/types/index.js
export const UserRole = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin'
};

export const OrderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal'
};

export const BusinessType = {
  BRAND: 'brand',
  WHOLESALER: 'wholesaler',
  MANUFACTURER: 'manufacturer',
  RETAILER: 'retailer',
  FARMER: 'farmer',
  SMALL_BUSINESS: 'small_business'
};

export const NotificationType = {
  ORDER_CREATED: 'order_created',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  ORDER_CANCELLED: 'order_cancelled',
  PAYMENT_RECEIVED: 'payment_received',
  PRODUCT_APPROVED: 'product_approved',
  PRODUCT_REJECTED: 'product_rejected'
};