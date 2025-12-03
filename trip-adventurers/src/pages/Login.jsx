import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/loginsignup.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Define valid credentials
  const VALID_EMAIL = "user@trip.com";
  const VALID_PASSWORD = "password123";

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError("");

    // Validate credentials
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // Success - navigate to trip list
      navigate("/trip-list");
    } else {
      // Show error message
      setError("Incorrect email or password. Please try again.");
    }
  };

  return (
    <div className="landing-page">
      {/* Title */}
      <h1 className="title">Trip Adventuers</h1>

      {/* Logo Image */}
      <img className="logo-img" src="../src/assets/logo.png" alt="Trip Adventurers Logo"/>

      {/* Login Text */}
      <h2 className="login-text">Log in</h2>
      
      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <div className={`input-wrapper email ${error ? 'input-error' : ''}`}>
          <div className="input-icon icon-mail">
            <div className="vector" />
          </div>
          <input 
            type="email" 
            className="label" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {/* Password Input */}
        <div className={`input-wrapper password ${error ? 'input-error' : ''}`}>
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
        
        {/* Log In Button */}
        <button type="submit" className="button btn-login">
          <span className="button-text-login">Log In</span>
        </button>
      </form>
      
      {/* No Account Text */}
      <p className="no-account">Don't have an account?</p>
      
      {/* Sign Up Button */}
      <button 
        className="button btn-signup"
        onClick={() => navigate("/signup")}
      >
        <span className="button-text-signup">Sign up</span>
      </button>
    </div>
  );
}