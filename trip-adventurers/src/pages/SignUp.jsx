import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/loginsignup.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToLocation, setAgreedToLocation] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const navigate = useNavigate();

  // Password validation requirements
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const allPasswordReqsMet = Object.values(passwordRequirements).every(req => req);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const isValidPhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError("");
    setSuccess(false);

    // Validation checks
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address (e.g., user@example.com).");
      return;
    }

    if (!allPasswordReqsMet) {
      setError("Password does not meet all requirements. Please check below.");
      setShowPasswordReqs(true);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (phoneNumber && !isValidPhone(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions to continue.");
      return;
    }

    if (!agreedToLocation) {
      setError("You must agree to Location Services to continue.");
      return;
    }

    // Success - in a real app, this would make an API call
    setSuccess(true);
    
    // Navigate to trip list after a brief delay
    setTimeout(() => {
      navigate("/trip-list");
    }, 1500);
  };

  return (
    <div className="landing-page">
      {/* Title */}
      <h1 className="title">Trip Adventuers</h1>
      
      {/* Sign Up Text */}
      <h2 className="login-text">Sign Up</h2>
      
      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="success-message">
          Account created successfully! Redirecting...
        </div>
      )}
      
      <form onSubmit={handleSignUp}>
        {/* Email Input */}
        <div className={`input-wrapper email ${error && !isValidEmail(email) ? 'input-error' : ''}`}>
          <div className="input-icon icon-mail">
            <div className="vector" />
          </div>
          <input 
            type="email" 
            className="label" 
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Email Requirements */}
        {email && !isValidEmail(email) && (
          <div className="requirements-box">
            <p className="req-item req-invalid">
              ✗ Must be a valid email format (user@example.com)
            </p>
          </div>
        )}
        
        {/* Password Input */}
        <div className={`input-wrapper password ${error && !allPasswordReqsMet ? 'input-error' : ''}`}>
          <div className="input-icon icon-lock">
            <div className="vector" />
          </div>
          <input 
            type="password" 
            className="label" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowPasswordReqs(true)}
            required
          />
        </div>

        {/* Password Requirements */}
        {showPasswordReqs && password && (
          <div className="requirements-box">
            <p className="requirements-title">Password must contain:</p>
            <p className={`req-item ${passwordRequirements.length ? 'req-valid' : 'req-invalid'}`}>
              {passwordRequirements.length ? '✓' : '✗'} At least 8 characters
            </p>
            <p className={`req-item ${passwordRequirements.uppercase ? 'req-valid' : 'req-invalid'}`}>
              {passwordRequirements.uppercase ? '✓' : '✗'} One uppercase letter (A-Z)
            </p>
            <p className={`req-item ${passwordRequirements.lowercase ? 'req-valid' : 'req-invalid'}`}>
              {passwordRequirements.lowercase ? '✓' : '✗'} One lowercase letter (a-z)
            </p>
            <p className={`req-item ${passwordRequirements.number ? 'req-valid' : 'req-invalid'}`}>
              {passwordRequirements.number ? '✓' : '✗'} One number (0-9)
            </p>
            <p className={`req-item ${passwordRequirements.special ? 'req-valid' : 'req-invalid'}`}>
              {passwordRequirements.special ? '✓' : '✗'} One special character (!@#$%^&*)
            </p>
          </div>
        )}

        {/* Confirm Password Input */}
        <div className={`input-wrapper password ${error && password !== confirmPassword ? 'input-error' : ''}`}>
          <div className="input-icon icon-lock">
            <div className="vector" />
          </div>
          <input 
            type="password" 
            className="label" 
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="requirements-box">
            <p className={`req-item ${password === confirmPassword ? 'req-valid' : 'req-invalid'}`}>
              {password === confirmPassword ? '✓' : '✗'} Passwords match
            </p>
          </div>
        )}

        {/* Phone Number Input */}
        <div className={`input-wrapper phone ${error && phoneNumber && !isValidPhone(phoneNumber) ? 'input-error' : ''}`}>
          <div className="input-icon icon-phone">
            <div className="vector" />
          </div>
          <input 
            type="tel" 
            className="label" 
            placeholder="Phone Number (Optional)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Phone Requirements */}
        {phoneNumber && !isValidPhone(phoneNumber) && (
          <div className="requirements-box">
            <p className="req-item req-invalid">
              ✗ Must be 10 digits (e.g., 1234567890)
            </p>
          </div>
        )}

        {/* Terms and Agreements Section */}
        <div className="agreements-section">
          {/* Terms and Conditions */}
          <div className="checkbox-wrapper">
            <input 
              type="checkbox" 
              id="terms-checkbox"
              className="agreement-checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <label htmlFor="terms-checkbox" className="checkbox-label">
              I agree to the <button type="button" className="link-button" onClick={() => setShowTermsModal(true)}>Terms and Conditions</button>
            </label>
          </div>

          {/* Location Services */}
          <div className="checkbox-wrapper">
            <input 
              type="checkbox" 
              id="location-checkbox"
              className="agreement-checkbox"
              checked={agreedToLocation}
              onChange={(e) => setAgreedToLocation(e.target.checked)}
            />
            <label htmlFor="location-checkbox" className="checkbox-label">
              I agree to <button type="button" className="link-button" onClick={() => setShowLocationModal(true)}>Location Services</button>
            </label>
          </div>
        </div>
        
        {/* Sign Up Button */}
        <button 
          type="submit" 
          className="button btn-signup-primary"
          disabled={!agreedToTerms || !agreedToLocation}
        >
          <span className="button-text-signup">Sign Up</span>
        </button>
      </form>
      
      {/* Already Have Account Text */}
      <p className="no-account">Already have an account?</p>
      
      {/* Sign In Button */}
      <button 
        className="button btn-signin"
        onClick={() => navigate("/login")}
      >
        <span className="button-text-signin">Sign In</span>
      </button>
            {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Terms and Conditions</h2>
              <button className="modal-close" onClick={() => setShowTermsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-section-title">1. Account Information</p>
              <p className="modal-text">
                By creating an account with Trip Adventurers, you agree to provide accurate and complete information. 
                Your email and password will be used to authenticate your account and provide you with access to our services.
              </p>

              <p className="modal-section-title">2. Data Usage</p>
              <p className="modal-text">
                We collect and store your email address, encrypted password, and phone number (if provided) to:
              </p>
              <ul className="modal-list">
                <li>Manage your account and authentication</li>
                <li>Send important trip notifications and updates</li>
                <li>Provide customer support</li>
                <li>Improve our services</li>
              </ul>

              <p className="modal-section-title">3. Privacy & Security</p>
              <p className="modal-text">
                Your password is securely encrypted and never stored in plain text. We will never share your 
                personal information with third parties without your explicit consent, except as required by law.
              </p>

              <p className="modal-section-title">4. User Responsibilities</p>
              <p className="modal-text">
                You are responsible for maintaining the confidentiality of your account credentials and for all 
                activities that occur under your account. Please notify us immediately of any unauthorized use.
              </p>

              <p className="modal-section-title">5. Service Terms</p>
              <p className="modal-text">
                Trip Adventurers reserves the right to modify or terminate services at any time. We may update 
                these terms periodically, and continued use of the service constitutes acceptance of updated terms.
              </p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={() => setShowTermsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Services Modal */}
      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Location Services</h2>
              <button className="modal-close" onClick={() => setShowLocationModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-section-title">Why We Use Your Location</p>
              <p className="modal-text">
                Trip Adventurers uses your location information to enhance your travel planning experience. 
                Your location data helps us provide personalized and relevant features.
              </p>

              <p className="modal-section-title">How We Use Location Data</p>
              <ul className="modal-list">
                <li><strong>Find Nearby Destinations:</strong> Discover attractions, restaurants, and activities near you</li>
                <li><strong>Route Planning:</strong> Calculate distances and travel times between trip locations</li>
                <li><strong>Local Recommendations:</strong> Suggest trips and activities based on your current location</li>
                <li><strong>Weather Information:</strong> Provide real-time weather updates for your destinations</li>
                <li><strong>Trip Tracking:</strong> Help you navigate and track your journey</li>
              </ul>

              <p className="modal-section-title">Your Privacy Matters</p>
              <p className="modal-text">
                Your location data is only collected when you're actively using the app. We do not track or 
                store your location history without your permission. You can disable location services at any 
                time in your device settings or app preferences.
              </p>

              <p className="modal-section-title">Data Security</p>
              <p className="modal-text">
                Location information is transmitted securely and stored with encryption. We never sell your 
                location data to third parties.
              </p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={() => setShowLocationModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}