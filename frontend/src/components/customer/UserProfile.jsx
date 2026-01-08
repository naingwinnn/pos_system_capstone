import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateUserProfile, logoutUser, getCartStats } = useCart();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const cartStats = getCartStats();

  if (!user) {
    return (
      <div className="user-not-logged-in">
        <h2>Please log in to view profile</h2>
        <button onClick={() => navigate('/')} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateUserProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Home
        </button>
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        {/* Left Column - Profile Info */}
        <div className="profile-left">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <img src={user.avatar} alt={user.name} className="profile-avatar" />
              <div className="profile-badge">Gold Member</div>
            </div>

            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={editForm.address}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleSave} className="save-btn">
                    Save Changes
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p className="profile-email">{user.email}</p>
                
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{user.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{user.address}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since:</span>
                    <span className="info-value">{user.joinDate}</span>
                  </div>
                </div>

                <div className="loyalty-section">
                  <div className="loyalty-points">
                    <span className="points-label">Loyalty Points</span>
                    <span className="points-value">{user.loyaltyPoints}</span>
                  </div>
                  <div className="points-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(user.loyaltyPoints % 1000) / 10}%` }}
                      ></div>
                    </div>
                    <span className="points-remaining">
                      {1000 - (user.loyaltyPoints % 1000)} points to next level
                    </span>
                  </div>
                </div>

                <button onClick={handleEdit} className="edit-profile-btn">
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="profile-right">
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-content">
                <h3>{cartStats.totalItems}</h3>
                <p>Items in Cart</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏪</div>
              <div className="stat-content">
                <h3>{cartStats.shopCount}</h3>
                <p>Shops</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{user.loyaltyPoints}</h3>
                <p>Loyalty Points</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>{user.orderHistory?.length || 0}</h3>
                <p>Past Orders</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button onClick={() => navigate('/cart')} className="action-btn cart-btn">
                View Cart ({cartStats.totalItems})
              </button>
              <button onClick={() => navigate('/')} className="action-btn shop-btn">
                Continue Shopping
              </button>
              <button onClick={handleLogout} className="action-btn logout-btn">
                Log Out
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          {user.orderHistory && user.orderHistory.length > 0 && (
            <div className="recent-orders">
              <h3>Recent Orders</h3>
              <div className="orders-list">
                {user.orderHistory.slice(0, 3).map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-shop">{order.shopName}</span>
                      <span className={`order-status ${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <span className="order-date">{order.date}</span>
                      <span className="order-items">{order.items} items</span>
                      <span className="order-total">${order.total}</span>
                    </div>
                    <button className="order-action-btn">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
              <button className="view-all-orders">
                View All Orders →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;