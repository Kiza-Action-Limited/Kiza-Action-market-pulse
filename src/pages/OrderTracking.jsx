// src/pages/OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle, FaTruck, FaBox, FaHourglassHalf, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

const OrderTracking = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const [orderRes, trackingRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/orders/${id}/tracking`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setOrder(orderRes.data.order);
      setTracking(trackingRes.data.tracking);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-gray-600">The order you're looking for doesn't exist.</p>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);
  const steps = [
    { label: 'Order Placed', icon: FaBox, status: 'pending' },
    { label: 'Processing', icon: FaHourglassHalf, status: 'processing' },
    { label: 'Shipped', icon: FaTruck, status: 'shipped' },
    { label: 'Delivered', icon: FaMapMarkerAlt, status: 'delivered' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Track Order #{order.id.slice(-8)}</h1>
      
      {/* Order Status Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary transform -translate-y-1/2 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}>
                    {isCompleted ? <FaCheckCircle /> : <Icon />}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`font-semibold ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {step.status === order.status && (
                      <p className="text-sm text-green-600">Current</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Tracking Details */}
      {tracking && tracking.updates && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tracking Updates</h2>
          <div className="space-y-4">
            {tracking.updates.map((update, index) => (
              <div key={index} className="flex border-l-2 border-primary pl-4 pb-4">
                <div className="flex-1">
                  <p className="font-semibold">{update.status}</p>
                  <p className="text-gray-600 text-sm">{update.location}</p>
                  <p className="text-gray-400 text-xs">{new Date(update.timestamp).toLocaleString()}</p>
                </div>
                {update.description && (
                  <p className="text-gray-500 text-sm">{update.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image || 'https://via.placeholder.com/50'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatCurrency(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-gray-600">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.addressLine1}<br />
            {order.shippingAddress.addressLine2 && `${order.shippingAddress.addressLine2}<br />`}
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
            {order.shippingAddress.country}<br />
            Phone: {order.shippingAddress.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
