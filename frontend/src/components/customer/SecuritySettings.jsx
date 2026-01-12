import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './SecuritySettings.css';

const SecuritySettings = () => {
  const { user, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Two-factor authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  
  // Login sessions state
  const [loginSessions, setLoginSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, USA', lastActive: 'Just now', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'San Francisco, USA', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'Firefox on Mac', location: 'London, UK', lastActive: '1 day ago', current: false }
  ]);
  
  // Email preferences state
  const [emailPreferences, setEmailPreferences] = useState({
    securityAlerts: true,
    loginNotifications: true,
    passwordChanges: true,
    marketingEmails: false,
    newsletter: false
  });
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    allowProfileView: true,
    showActivityStatus: false,
    dataSharing: false
  });
  
  // Initialize from localStorage
  useEffect(() => {
    const saved2FA = localStorage.getItem('twoFactorEnabled') === 'true';
    const savedEmailPrefs = JSON.parse(localStorage.getItem('emailPreferences') || '{}');
    const savedPrivacyPrefs = JSON.parse(localStorage.getItem('privacySettings') || '{}');
    
    if (saved2FA) setTwoFactorEnabled(saved2FA);
    if (Object.keys(savedEmailPrefs).length > 0) setEmailPreferences(savedEmailPrefs);
    if (Object.keys(savedPrivacyPrefs).length > 0) setPrivacySettings(savedPrivacyPrefs);
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      return 'All password fields are required';
    }
    
    if (passwordData.newPassword.length < 6) {
      return 'New password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return 'New passwords do not match';
    }
    
    return '';
  };

  const handleChangePassword = async () => {
    const error = validatePassword();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Password changed successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Logout after password change (security best practice)
        setTimeout(() => {
          setMessage({ 
            type: 'info', 
            text: 'You will be logged out in 5 seconds to secure your account...' 
          });
          setTimeout(() => {
            logout();
            navigate('/login', { 
              state: { message: 'Password changed successfully. Please login with your new password.' }
            });
          }, 5000);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = () => {
    setShowTwoFactorSetup(true);
  };

  const handleVerify2FA = () => {
    // Simulate 2FA verification
    if (twoFactorCode === '123456') { // Demo code
      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setTwoFactorCode('');
      localStorage.setItem('twoFactorEnabled', 'true');
      setMessage({ type: 'success', text: 'Two-factor authentication enabled successfully!' });
    } else {
      setMessage({ type: 'error', text: 'Invalid verification code. Please try again.' });
    }
  };

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false);
    localStorage.setItem('twoFactorEnabled', 'false');
    setMessage({ type: 'success', text: 'Two-factor authentication disabled.' });
  };

  const handleTerminateSession = (sessionId) => {
    setLoginSessions(sessions => sessions.filter(session => session.id !== sessionId));
    setMessage({ type: 'success', text: 'Session terminated successfully.' });
    
    // If current session is terminated, logout
    if (sessionId === 1) {
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1000);
    }
  };

  const handleTerminateAllSessions = () => {
    if (window.confirm('Are you sure you want to logout from all devices?')) {
      logout();
      navigate('/login', { 
        state: { message: 'Logged out from all devices. Please login again.' }
      });
    }
  };

  const handleEmailPreferenceChange = (key) => {
    setEmailPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('emailPreferences', JSON.stringify(updated));
      return updated;
    });
  };

  const handlePrivacySettingChange = (key) => {
    setPrivacySettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('privacySettings', JSON.stringify(updated));
      return updated;
    });
  };

  const handleExportData = () => {
    const userData = {
      profile: user,
      emailPreferences,
      privacySettings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pos-marketplace-data-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setMessage({ type: 'success', text: 'Data exported successfully!' });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure? This will permanently delete your account and all associated data. This action cannot be undone.')) {
      if (window.confirm('Type "DELETE" to confirm:')) {
        // Simulate account deletion
        setTimeout(() => {
          logout();
          navigate('/register', { 
            state: { 
              message: 'Your account has been deleted successfully. We\'re sorry to see you go!' 
            }
          });
        }, 2000);
      }
    }
  };

  if (!user) {
    return (
      <div className="security-settings-page">
        <div className="security-container">
          <div className="no-access">
            <div className="no-access-icon">🔒</div>
            <h2>Access Denied</h2>
            <p>Please login to access security settings</p>
            <button onClick={() => navigate('/login')} className="login-btn">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="security-settings-page">
      <div className="security-container">
        {/* Header */}
        <div className="security-header">
          <button onClick={() => navigate('/profile')} className="back-btn">
            ← Back to Profile
          </button>
          <h1>Security & Privacy Settings</h1>
          <p className="security-subtitle">
            Manage your account security, privacy, and data preferences
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            <span className="alert-icon">
              {message.type === 'success' ? '✓' : message.type === 'error' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="alert-text">{message.text}</span>
            <button 
              onClick={() => setMessage({ type: '', text: '' })}
              className="alert-close"
            >
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="security-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            🔒 Security Overview
          </button>
          <button 
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔑 Password
          </button>
          <button 
            className={`tab ${activeTab === '2fa' ? 'active' : ''}`}
            onClick={() => setActiveTab('2fa')}
          >
            ⚙️ Two-Factor Auth
          </button>
          <button 
            className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            📱 Login Sessions
          </button>
          <button 
            className={`tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            👁️ Privacy
          </button>
          <button 
            className={`tab ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            💾 Data Management
          </button>
        </div>

        {/* Tab Content */}
        <div className="security-content">
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <div className="security-overview">
                <div className="overview-grid">
                  <div className="overview-card">
                    <div className="overview-icon">🔒</div>
                    <h3>Account Security</h3>
                    <div className="overview-status">
                      <span className={`status-badge ${passwordData.newPassword ? 'good' : 'warning'}`}>
                        {passwordData.newPassword ? 'Strong Password' : 'Change Password'}
                      </span>
                    </div>
                    <p>Last changed: 3 months ago</p>
                    <button 
                      onClick={() => setActiveTab('password')}
                      className="overview-action"
                    >
                      Manage Password
                    </button>
                  </div>
                  
                  <div className="overview-card">
                    <div className="overview-icon">⚙️</div>
                    <h3>Two-Factor Auth</h3>
                    <div className="overview-status">
                      <span className={`status-badge ${twoFactorEnabled ? 'good' : 'warning'}`}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p>Add an extra layer of security</p>
                    <button 
                      onClick={() => setActiveTab('2fa')}
                      className="overview-action"
                    >
                      {twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                    </button>
                  </div>
                  
                  <div className="overview-card">
                    <div className="overview-icon">📱</div>
                    <h3>Active Sessions</h3>
                    <div className="overview-status">
                      <span className="status-badge info">
                        {loginSessions.length} devices
                      </span>
                    </div>
                    <p>Manage your logged-in devices</p>
                    <button 
                      onClick={() => setActiveTab('sessions')}
                      className="overview-action"
                    >
                      View Sessions
                    </button>
                  </div>
                  
                  <div className="overview-card">
                    <div className="overview-icon">👁️</div>
                    <h3>Privacy Settings</h3>
                    <div className="overview-status">
                      <span className="status-badge info">
                        Customized
                      </span>
                    </div>
                    <p>Control your privacy preferences</p>
                    <button 
                      onClick={() => setActiveTab('privacy')}
                      className="overview-action"
                    >
                      Privacy Settings
                    </button>
                  </div>
                </div>
                
                <div className="security-tips">
                  <h3>🔐 Security Tips</h3>
                  <ul>
                    <li>Use a strong, unique password for your account</li>
                    <li>Enable two-factor authentication for extra security</li>
                    <li>Regularly review your active login sessions</li>
                    <li>Keep your recovery email up to date</li>
                    <li>Be cautious of suspicious emails or messages</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="tab-pane">
              <div className="password-settings">
                <h2>Password Settings</h2>
                <p className="section-description">
                  Change your password regularly to keep your account secure.
                </p>
                
                <div className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter new password (min. 6 characters)"
                    />
                    <div className="password-strength">
                      <div className={`strength-bar ${passwordData.newPassword.length >= 6 ? 'strong' : 'weak'}`}></div>
                      <span className="strength-text">
                        {passwordData.newPassword.length >= 6 ? 'Strong password' : 'Weak password'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Confirm your new password"
                    />
                  </div>
                  
                  <div className="password-requirements">
                    <h4>Password Requirements:</h4>
                    <ul>
                      <li className={passwordData.newPassword.length >= 6 ? 'met' : ''}>
                        At least 6 characters long
                      </li>
                      <li className={passwordData.newPassword !== passwordData.currentPassword && passwordData.newPassword ? 'met' : ''}>
                        Different from current password
                      </li>
                      <li className={passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword ? 'met' : ''}>
                        Passwords match
                      </li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={handleChangePassword}
                    className="save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === '2fa' && (
            <div className="tab-pane">
              <div className="two-factor-settings">
                <h2>Two-Factor Authentication</h2>
                <p className="section-description">
                  Add an extra layer of security to your account. When enabled, you'll need to enter a verification code from your authenticator app when signing in.
                </p>
                
                {!twoFactorEnabled ? (
                  <div className="two-factor-setup">
                    {!showTwoFactorSetup ? (
                      <>
                        <div className="setup-info">
                          <div className="setup-icon">📱</div>
                          <h3>Get Started with 2FA</h3>
                          <p>Set up two-factor authentication using an authenticator app like Google Authenticator or Authy.</p>
                          
                          <div className="setup-steps">
                            <div className="step">
                              <span className="step-number">1</span>
                              <span className="step-text">Install an authenticator app on your phone</span>
                            </div>
                            <div className="step">
                              <span className="step-number">2</span>
                              <span className="step-text">Scan the QR code or enter the setup key</span>
                            </div>
                            <div className="step">
                              <span className="step-number">3</span>
                              <span className="step-text">Enter the verification code from your app</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="setup-demo">
                          <div className="demo-qr">
                            {/* Placeholder QR code */}
                            <div className="qr-placeholder">
                              <div className="qr-grid">
                                {Array(25).fill(0).map((_, i) => (
                                  <div key={i} className="qr-cell"></div>
                                ))}
                              </div>
                            </div>
                            <p className="qr-hint">Scan this QR code with your authenticator app</p>
                          </div>
                          
                          <div className="setup-key">
                            <p><strong>Setup Key:</strong> JBSWY3DPEHPK3PXP</p>
                            <button className="copy-key">Copy Key</button>
                          </div>
                        </div>
                        
                        <button onClick={handleEnable2FA} className="enable-2fa-btn">
                          Enable Two-Factor Authentication
                        </button>
                      </>
                    ) : (
                      <div className="verification-step">
                        <h3>Enter Verification Code</h3>
                        <p>Open your authenticator app and enter the 6-digit code:</p>
                        
                        <div className="verification-input">
                          <input
                            type="text"
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value)}
                            placeholder="000000"
                            maxLength="6"
                            className="code-input"
                          />
                        </div>
                        
                        <div className="verification-actions">
                          <button onClick={handleVerify2FA} className="verify-btn">
                            Verify & Enable
                          </button>
                          <button 
                            onClick={() => setShowTwoFactorSetup(false)}
                            className="cancel-btn"
                          >
                            Cancel
                          </button>
                        </div>
                        
                        <div className="verification-help">
                          <p><strong>Demo:</strong> Enter "123456" to enable 2FA</p>
                          <p>Can't scan the QR code? Enter the setup key manually in your app.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="two-factor-enabled">
                    <div className="enabled-header">
                      <div className="enabled-icon">✅</div>
                      <h3>Two-Factor Authentication is Enabled</h3>
                    </div>
                    
                    <div className="enabled-info">
                      <p>Your account is protected with an extra layer of security. You'll need to enter a verification code from your authenticator app when signing in.</p>
                      
                      <div className="backup-codes">
                        <h4>Backup Codes</h4>
                        <p>Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.</p>
                        <div className="codes-grid">
                          {['ABCD1234', 'EFGH5678', 'IJKL9012', 'MNOP3456', 'QRST7890'].map((code, i) => (
                            <div key={i} className="backup-code">{code}</div>
                          ))}
                        </div>
                        <button className="generate-new-codes">Generate New Codes</button>
                      </div>
                      
                      <button onClick={handleDisable2FA} className="disable-2fa-btn">
                        Disable Two-Factor Authentication
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="tab-pane">
              <div className="sessions-settings">
                <h2>Login Sessions</h2>
                <p className="section-description">
                  Review devices that are currently logged into your account. Log out from any unfamiliar devices.
                </p>
                
                <div className="current-session">
                  <h3>Current Session</h3>
                  <div className="session-card current">
                    <div className="session-info">
                      <div className="session-device">🖥️ {loginSessions[0]?.device}</div>
                      <div className="session-details">
                        <span className="session-location">📍 {loginSessions[0]?.location}</span>
                        <span className="session-time">🕒 {loginSessions[0]?.lastActive}</span>
                      </div>
                    </div>
                    <span className="session-badge current-badge">Current</span>
                  </div>
                </div>
                
                <div className="other-sessions">
                  <h3>Other Active Sessions</h3>
                  {loginSessions.slice(1).map(session => (
                    <div key={session.id} className="session-card">
                      <div className="session-info">
                        <div className="session-device">
                          {session.device.includes('iPhone') ? '📱' : '💻'} {session.device}
                        </div>
                        <div className="session-details">
                          <span className="session-location">📍 {session.location}</span>
                          <span className="session-time">🕒 {session.lastActive}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleTerminateSession(session.id)}
                        className="terminate-btn"
                      >
                        Terminate
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="sessions-actions">
                  <button onClick={handleTerminateAllSessions} className="terminate-all-btn">
                    Log Out From All Devices
                  </button>
                  <p className="warning-text">
                    ⚠️ This will log you out from all devices including this one.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="tab-pane">
              <div className="privacy-settings">
                <h2>Privacy Settings</h2>
                <p className="section-description">
                  Control how your information is shared and who can see your activity.
                </p>
                
                <div className="privacy-section">
                  <h3>Profile Privacy</h3>
                  <div className="privacy-options">
                    <div className="privacy-option">
                      <div className="option-info">
                        <h4>Show Online Status</h4>
                        <p>Allow other users to see when you're online</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={privacySettings.showOnlineStatus}
                          onChange={() => handlePrivacySettingChange('showOnlineStatus')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <div className="option-info">
                        <h4>Allow Profile View</h4>
                        <p>Allow other users to view your profile</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={privacySettings.allowProfileView}
                          onChange={() => handlePrivacySettingChange('allowProfileView')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <div className="option-info">
                        <h4>Show Activity Status</h4>
                        <p>Show your recent activity to other users</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={privacySettings.showActivityStatus}
                          onChange={() => handlePrivacySettingChange('showActivityStatus')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <div className="option-info">
                        <h4>Data Sharing for Analytics</h4>
                        <p>Allow anonymized data collection to improve our services</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={privacySettings.dataSharing}
                          onChange={() => handlePrivacySettingChange('dataSharing')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="privacy-section">
                  <h3>Email Preferences</h3>
                  <div className="privacy-options">
                    <div className="privacy-option">
                      <div className="option-info">
                        <h4>Security Alerts</h4>
                        <p>Receive emails about important security events</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={emailPreferences.securityAlerts}
                          onChange={() => handleEmailPreferenceChange('securityAlerts')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <div className="option-info">
                        <h4>Login Notifications</h4>
                        <p>Get notified when someone logs into your account</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={emailPreferences.loginNotifications}
                          onChange={() => handleEmailPreferenceChange('loginNotifications')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <div className="option-info">
                        <h4>Password Change Confirmations</h4>
                        <p>Receive confirmation when your password is changed</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={emailPreferences.passwordChanges}
                          onChange={() => handleEmailPreferenceChange('passwordChanges')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <div className="option-info">
                        <h4>Marketing Emails</h4>
                        <p>Receive promotional offers and updates</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={emailPreferences.marketingEmails}
                          onChange={() => handleEmailPreferenceChange('marketingEmails')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <div className="option-info">
                        <h4>Newsletter</h4>
                        <p>Subscribe to our weekly newsletter</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={emailPreferences.newsletter}
                          onChange={() => handleEmailPreferenceChange('newsletter')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="tab-pane">
              <div className="data-settings">
                <h2>Data Management</h2>
                <p className="section-description">
                  Control your data and account information.
                </p>
                
                <div className="data-options">
                  <div className="data-option">
                    <div className="option-content">
                      <div className="option-icon">📥</div>
                      <div className="option-info">
                        <h3>Export Your Data</h3>
                        <p>Download a copy of your personal data, including profile information, preferences, and activity history.</p>
                      </div>
                    </div>
                    <button onClick={handleExportData} className="export-btn">
                      Export Data
                    </button>
                  </div>
                  
                  <div className="data-option dangerous">
                    <div className="option-content">
                      <div className="option-icon">🗑️</div>
                      <div className="option-info">
                        <h3>Delete Your Account</h3>
                        <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                      </div>
                    </div>
                    <button onClick={handleDeleteAccount} className="delete-btn">
                      Delete Account
                    </button>
                  </div>
                </div>
                
                <div className="data-info">
                  <h3>What happens when you delete your account?</h3>
                  <ul>
                    <li>Your profile will be permanently removed</li>
                    <li>All your data will be deleted from our servers</li>
                    <li>You will lose access to all your orders and history</li>
                    <li>This action cannot be reversed</li>
                    <li>You can create a new account anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;