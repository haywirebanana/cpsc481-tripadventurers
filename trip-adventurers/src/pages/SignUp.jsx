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
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError("");
    setSuccess(false);

    // Validation checks
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phoneNumber && phoneNumber.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    // Success - in a real app, this would make an API call
    setSuccess(true);
    
    // Navigate to login after a brief delay
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
          Account created successfully! Redirecting to login...
        </div>
      )}
      
      <form onSubmit={handleSignUp}>
        {/* Email Input */}
        <div className={`input-wrapper email ${error ? 'input-error' : ''}`}>
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
        
        {/* Password Input */}
        <div className={`input-wrapper password ${error && password !== confirmPassword ? 'input-error' : ''}`}>
          <div className="input-icon icon-lock">
            <div className="vector" />
          </div>
          <input 
            type="password" 
            className="label" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

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

        {/* Phone Number Input */}
        <div className={`input-wrapper phone`}>
          <div className="input-icon icon-phone">
            <div className="vector" />
          </div>
          <input 
            type="tel" 
            className="label" 
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        
        {/* Sign Up Button */}
        <button type="submit" className="button btn-signup-primary">
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
    </div>
  );
}