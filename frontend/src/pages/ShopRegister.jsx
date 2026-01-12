import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ShopRegister.css';

const ShopRegister = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopType: '',
    address: '',
    city: '',
    zipCode: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { registerShop } = useAuth();

  const shopTypes = [
    'Restaurant/Cafe',
    'Grocery Store',
    'Pharmacy',
    'Electronics',
    'Fashion & Clothing',
    'Hardware Store',
    'Beauty & Salon',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Shop name validation
    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    } else if (formData.shopName.trim().length < 2) {
      newErrors.shopName = 'Shop name must be at least 2 characters';
    }
    
    // Owner name validation
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Shop type validation
    if (!formData.shopType) {
      newErrors.shopType = 'Please select a shop type';
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    // Zip code validation
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }
    
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call for shop registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call authentication context for shop registration
      const success = await registerShop({
        shopName: formData.shopName.trim(),
        ownerName: formData.ownerName.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        password: formData.password,
        shopType: formData.shopType,
        address: formData.address.trim(),
        city: formData.city.trim(),
        zipCode: formData.zipCode.trim(),
        registrationDate: new Date().toISOString()
      });
      
      if (success) {
        // Show success message and redirect
        alert('Registration successful! Please check your email for verification.');
        navigate('/shop/dashboard', { replace: true });
      } else {
        setErrors({ general: 'Registration failed. Email might already be registered.' });
      }
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoRegistration = () => {
    setFormData({
      shopName: 'Demo Shop',
      ownerName: 'John Doe',
      email: 'shop@demo.com',
      phone: '1234567890',
      password: 'DemoShop123',
      confirmPassword: 'DemoShop123',
      shopType: 'Restaurant/Cafe',
      address: '123 Main Street',
      city: 'New York',
      zipCode: '10001',
      agreeToTerms: true
    });
  };

  return (
    <div className="shop-register-page">
      <div className="shop-register-container">
        {/* Left Side - Shop Registration Info */}
        <div className="shop-register-left">
          <div className="shop-register-brand">
            <div className="brand-logo">🏪</div>
            <h1>Register Your Shop</h1>
            <p className="brand-tagline">Join our marketplace and start selling today</p>
          </div>
          
          <div className="shop-benefits">
            <div className="benefit">
              <div className="benefit-icon">💰</div>
              <div className="benefit-text">
                <h3>Increase Revenue</h3>
                <p>Reach thousands of customers in your area</p>
              </div>
            </div>
            
            <div className="benefit">
              <div className="benefit-icon">📱</div>
              <div className="benefit-text">
                <h3>Easy Management</h3>
                <p>Manage orders, inventory, and payments in one place</p>
              </div>
            </div>
            
            <div className="benefit">
              <div className="benefit-icon">🚀</div>
              <div className="benefit-text">
                <h3>Grow Your Business</h3>
                <p>Access analytics and marketing tools</p>
              </div>
            </div>
            
            <div className="benefit">
              <div className="benefit-icon">🔒</div>
              <div className="benefit-text">
                <h3>Secure Payments</h3>
                <p>Get paid securely and on time</p>
              </div>
            </div>
          </div>
          
          <div className="shop-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Shops</span>
            </div>
            <div className="stat">
              <span className="stat-number">25%</span>
              <span className="stat-label">Avg. Revenue Growth</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Seller Support</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Registration Form */}
        <div className="shop-register-right">
          <div className="shop-register-form-container">
            <div className="form-header">
              <h2>Create Shop Account</h2>
              <p>Fill in your shop details to get started</p>
            </div>
            
            {errors.general && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span className="alert-text">{errors.general}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="shop-register-form" noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="shopName" className="form-label">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.shopName ? 'error' : ''}`}
                    placeholder="Enter your shop name"
                    disabled={isLoading}
                  />
                  {errors.shopName && (
                    <span className="error-message">{errors.shopName}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="ownerName" className="form-label">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.ownerName ? 'error' : ''}`}
                    placeholder="Enter owner's full name"
                    disabled={isLoading}
                  />
                  {errors.ownerName && (
                    <span className="error-message">{errors.ownerName}</span>
                  )}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="shop@example.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="Enter phone number"
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="shopType" className="form-label">
                  Shop Type *
                </label>
                <select
                  id="shopType"
                  name="shopType"
                  value={formData.shopType}
                  onChange={handleInputChange}
                  className={`form-input ${errors.shopType ? 'error' : ''}`}
                  disabled={isLoading}
                >
                  <option value="">Select shop type</option>
                  {shopTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                {errors.shopType && (
                  <span className="error-message">{errors.shopType}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Shop Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Street address"
                  disabled={isLoading}
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city" className="form-label">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    placeholder="City"
                    disabled={isLoading}
                  />
                  {errors.city && (
                    <span className="error-message">{errors.city}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="zipCode" className="form-label">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`form-input ${errors.zipCode ? 'error' : ''}`}
                    placeholder="Zip code"
                    disabled={isLoading}
                  />
                  {errors.zipCode && (
                    <span className="error-message">{errors.zipCode}</span>
                  )}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password *
                  </label>
                  <div className="password-input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Create password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                  <div className="password-hints">
                    <span className={`hint ${formData.password.length >= 8 ? 'valid' : ''}`}>
                      • At least 8 characters
                    </span>
                    <span className={`hint ${/[a-z]/.test(formData.password) ? 'valid' : ''}`}>
                      • Lowercase letter
                    </span>
                    <span className={`hint ${/[A-Z]/.test(formData.password) ? 'valid' : ''}`}>
                      • Uppercase letter
                    </span>
                    <span className={`hint ${/\d/.test(formData.password) ? 'valid' : ''}`}>
                      • Number
                    </span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password *
                  </label>
                  <div className="password-input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>
              
              <div className="form-group terms-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={errors.agreeToTerms ? 'error' : ''}
                  />
                  <span className="checkbox-text">
                    I agree to the{' '}
                    <Link to="/vendor-terms" className="terms-link">
                      Vendor Terms & Conditions
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="terms-link">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <span className="error-message">{errors.agreeToTerms}</span>
                )}
              </div>
              
              <button
                type="submit"
                className="register-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Register Shop'
                )}
              </button>
              
              <div className="demo-register">
                <button
                  type="button"
                  onClick={handleDemoRegistration}
                  className="demo-btn"
                  disabled={isLoading}
                >
                  Fill with Demo Data
                </button>
              </div>
              
              <div className="login-link">
                <p>
                  Already have a shop account?{' '}
                  <Link to="/shop-login" className="link">
                    Sign in here
                  </Link>
                </p>
                <p>
                  Want to shop as customer?{' '}
                  <Link to="/register" className="link customer-link">
                    Register as customer
                  </Link>
                </p>
              </div>
            </form>
          </div>
          
          <div className="shop-register-footer">
            <p>Need help? Contact our seller support team</p>
            <div className="footer-links">
              <a href="mailto:support@posmarketplace.com" className="footer-link">
                support@posmarketplace.com
              </a>
              <span className="separator">•</span>
              <a href="tel:+11234567890" className="footer-link">
                +1 (123) 456-7890
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopRegister;