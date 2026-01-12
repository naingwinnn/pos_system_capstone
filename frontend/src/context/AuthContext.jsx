import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('pos-user');
        const savedToken = localStorage.getItem('pos-token');
        
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check registered users first
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find(u => u.email === email && u.password === password);
      
      if (registeredUser) {
        const userData = {
          id: registeredUser.id,
          email: registeredUser.email,
          name: registeredUser.name,
          role: registeredUser.role,
          phone: registeredUser.phone || '',
          address: registeredUser.address || '',
          joinedDate: registeredUser.joinedDate,
          avatar: registeredUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(registeredUser.name)}&background=667eea&color=fff&bold=true`
        };
        
        // Add shop-specific data if user is a vendor
        if (registeredUser.role === 'vendor') {
          userData.shopName = registeredUser.shopName;
          userData.shopType = registeredUser.shopType;
          userData.shopAddress = registeredUser.shopAddress;
          userData.shopCity = registeredUser.shopCity;
          userData.shopZipCode = registeredUser.shopZipCode;
          userData.shopVerified = registeredUser.shopVerified || false;
        }
        
        const token = 'mock-jwt-token-' + Date.now();
        
        setUser(userData);
        localStorage.setItem('pos-user', JSON.stringify(userData));
        localStorage.setItem('pos-token', token);
        
        return true;
      }
      
      // Fallback to mock users for demo accounts
      const mockUsers = [
        { 
          id: 1, 
          email: 'customer@demo.com', 
          name: 'John Doe', 
          role: 'customer',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, New York, NY 10001',
          joinedDate: '2024-01-15',
          password: 'demo123'
        },
        { 
          id: 2, 
          email: 'vendor@demo.com', 
          name: 'Jane Smith', 
          role: 'vendor',
          shopName: 'Burger Palace',
          shopType: 'Restaurant/Cafe',
          shopAddress: '456 Food Street',
          shopCity: 'New York',
          shopZipCode: '10002',
          shopVerified: true,
          phone: '+1 (555) 987-6543',
          joinedDate: '2024-02-20',
          password: 'demo123'
        },
        { 
          id: 3, 
          email: 'admin@demo.com', 
          name: 'Admin User', 
          role: 'admin',
          phone: '+1 (555) 456-7890',
          joinedDate: '2024-01-01',
          password: 'demo123'
        }
      ];
      
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (mockUser) {
        const userData = {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          phone: mockUser.phone,
          address: mockUser.address,
          joinedDate: mockUser.joinedDate,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockUser.name)}&background=667eea&color=fff&bold=true`
        };
        
        // Add shop-specific data if user is a vendor
        if (mockUser.role === 'vendor') {
          userData.shopName = mockUser.shopName;
          userData.shopType = mockUser.shopType;
          userData.shopAddress = mockUser.shopAddress;
          userData.shopCity = mockUser.shopCity;
          userData.shopZipCode = mockUser.shopZipCode;
          userData.shopVerified = mockUser.shopVerified;
        }
        
        const token = 'mock-jwt-token-' + Date.now();
        
        setUser(userData);
        localStorage.setItem('pos-user', JSON.stringify(userData));
        localStorage.setItem('pos-token', token);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pos-user');
    localStorage.removeItem('pos-token');
    localStorage.removeItem('rememberMe');
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get existing registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if email already exists
      if (registeredUsers.some(u => u.email === userData.email)) {
        return { success: false, error: 'Email already registered' };
      }
      
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: userData.role || 'customer',
        phone: userData.phone || '',
        address: userData.address || '',
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=667eea&color=fff&bold=true`,
        password: userData.password
      };
      
      // Save to registered users list
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Also save as current user and login automatically
      const token = 'mock-jwt-token-' + Date.now();
      
      setUser(newUser);
      localStorage.setItem('pos-user', JSON.stringify(newUser));
      localStorage.setItem('pos-token', token);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const registerShop = async (shopData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get existing registered users (shops are stored here too)
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if email already exists
      if (registeredUsers.some(u => u.email === shopData.email)) {
        return { success: false, error: 'Email already registered' };
      }
      
      // Check if shop name already exists
      if (registeredUsers.some(u => u.shopName && u.shopName.toLowerCase() === shopData.shopName.toLowerCase())) {
        return { success: false, error: 'Shop name already taken' };
      }
      
      const newShop = {
        id: Date.now(),
        email: shopData.email,
        name: shopData.ownerName,
        role: 'vendor',
        phone: shopData.phone,
        address: shopData.address,
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(shopData.shopName)}&background=10b981&color=fff&bold=true`,
        // Shop-specific fields
        shopName: shopData.shopName,
        shopType: shopData.shopType,
        shopAddress: shopData.address,
        shopCity: shopData.city,
        shopZipCode: shopData.zipCode,
        shopVerified: false,
        shopRegistrationDate: new Date().toISOString(),
        shopStatus: 'pending',
        password: shopData.password
      };
      
      // Save to registered users list
      registeredUsers.push(newShop);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Also save as current user and login automatically
      const token = 'mock-jwt-token-' + Date.now();
      
      setUser(newShop);
      localStorage.setItem('pos-user', JSON.stringify(newShop));
      localStorage.setItem('pos-token', token);
      
      // Store in separate shops list for management
      const registeredShops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      registeredShops.push({
        id: newShop.id,
        shopName: newShop.shopName,
        ownerName: newShop.name,
        email: newShop.email,
        phone: newShop.phone,
        shopType: newShop.shopType,
        address: newShop.address,
        city: newShop.shopCity,
        zipCode: newShop.shopZipCode,
        status: newShop.shopStatus,
        verified: newShop.shopVerified,
        registrationDate: newShop.shopRegistrationDate
      });
      localStorage.setItem('registeredShops', JSON.stringify(registeredShops));
      
      return { success: true, user: newShop };
    } catch (error) {
      console.error('Shop registration error:', error);
      return { success: false, error: 'Shop registration failed' };
    }
  };

  const updateProfile = async (userData) => {
    try {
      // Update registered users list if needed
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        // Don't include password in profile updates
        const {  ...userDataWithoutPassword } = userData;
        registeredUsers[userIndex] = { 
          ...registeredUsers[userIndex], 
          ...userDataWithoutPassword,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      // Update current user (without password)
      const {  ...userDataWithoutPassword } = userData;
      const updatedUser = { ...user, ...userDataWithoutPassword };
      setUser(updatedUser);
      localStorage.setItem('pos-user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Update failed' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Enhanced password validation
      if (newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters' };
      }

      // Get all user data from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const mockUsers = [
        { id: 1, email: 'customer@demo.com', password: 'demo123' },
        { id: 2, email: 'vendor@demo.com', password: 'demo123' },
        { id: 3, email: 'admin@demo.com', password: 'demo123' }
      ];

      // Find user in both arrays
      let userData = null;
      let userIndex = -1;
      
      // First check registered users
      userIndex = registeredUsers.findIndex(u => u.email === user.email);
      if (userIndex !== -1) {
        userData = registeredUsers[userIndex];
      } else {
        // Check mock users
        const mockUser = mockUsers.find(u => u.email === user.email);
        if (mockUser) {
          userData = mockUser;
        }
      }

      if (!userData) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      if (userData.password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Check if new password is same as current
      if (currentPassword === newPassword) {
        return { success: false, error: 'New password must be different from current password' };
      }

      // Update password in registeredUsers
      if (userIndex === -1) {
        // User not in registeredUsers, add them
        const newUserEntry = {
          ...user,
          password: newPassword,
          updatedAt: new Date().toISOString()
        };
        registeredUsers.push(newUserEntry);
      } else {
        // Update existing user
        registeredUsers[userIndex] = {
          ...registeredUsers[userIndex],
          password: newPassword,
          updatedAt: new Date().toISOString()
        };
      }

      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      return { 
        success: true, 
        message: 'Password changed successfully! You can now login with your new password.' 
      };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Failed to change password. Please try again.' };
    }
  };

  const getAllShops = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const registeredShops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      return { success: true, shops: registeredShops };
    } catch (error) {
      console.error('Get shops error:', error);
      return { success: false, error: 'Failed to get shops' };
    }
  };

  const updateShopStatus = async (shopId, status) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update in registered shops list
      const registeredShops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      const shopIndex = registeredShops.findIndex(shop => shop.id === shopId);
      
      if (shopIndex !== -1) {
        registeredShops[shopIndex] = {
          ...registeredShops[shopIndex],
          status: status,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('registeredShops', JSON.stringify(registeredShops));
      }
      
      // Also update in registered users list
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex(u => u.id === shopId);
      
      if (userIndex !== -1) {
        registeredUsers[userIndex] = {
          ...registeredUsers[userIndex],
          shopStatus: status,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Update current user if it's the same user
        if (user && user.id === shopId) {
          setUser(prev => ({ ...prev, shopStatus: status }));
          localStorage.setItem('pos-user', JSON.stringify({ ...user, shopStatus: status }));
        }
      }
      
      return { success: true, message: `Shop status updated to ${status}` };
    } catch (error) {
      console.error('Update shop status error:', error);
      return { success: false, error: 'Failed to update shop status' };
    }
  };

  const verifyShop = async (shopId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update in registered shops list
      const registeredShops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      const shopIndex = registeredShops.findIndex(shop => shop.id === shopId);
      
      if (shopIndex !== -1) {
        registeredShops[shopIndex] = {
          ...registeredShops[shopIndex],
          verified: true,
          status: 'active',
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('registeredShops', JSON.stringify(registeredShops));
      }
      
      // Also update in registered users list
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex(u => u.id === shopId);
      
      if (userIndex !== -1) {
        registeredUsers[userIndex] = {
          ...registeredUsers[userIndex],
          shopVerified: true,
          shopStatus: 'active',
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Update current user if it's the same user
        if (user && user.id === shopId) {
          setUser(prev => ({ ...prev, shopVerified: true, shopStatus: 'active' }));
          localStorage.setItem('pos-user', JSON.stringify({ ...user, shopVerified: true, shopStatus: 'active' }));
        }
      }
      
      return { success: true, message: 'Shop verified successfully' };
    } catch (error) {
      console.error('Verify shop error:', error);
      return { success: false, error: 'Failed to verify shop' };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    registerShop,
    updateProfile,
    changePassword,
    getAllShops,
    updateShopStatus,
    verifyShop,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};