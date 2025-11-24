import { Link } from "react-router-dom";
import "../styles/loginsignup.css";

export default function Login() {
  return (
    <div className="landing-page">
      {/* Title */}
      <h1 className="title">Trip Adventuers</h1>
      
      {/* Login Text */}
      <h2 className="login-text">Log in</h2>
      
      {/* Email Input */}
      <div className="input-wrapper email">
        <div className="input-icon icon-mail">
          <div className="vector" />
        </div>
        <input 
          type="email" 
          className="label" 
          placeholder="Email"
        />
      </div>
      
      {/* Password Input */}
      <div className="input-wrapper password">
        <div className="input-icon icon-lock">
          <div className="vector" />
        </div>
        <input 
          type="password" 
          className="label" 
          placeholder="Password"
        />
      </div>
      
      {/* Sign In Button */}
      <Link to="/trip-list">
        <button className="button btn-signin">
          <span>Sign in</span>
        </button>
      </Link>
      
      {/* No Account Text */}
      <p className="no-account">Don't have an account?</p>
      
      {/* Sign Up Button */}
      <Link to="/signup">
        <button className="button btn-signup">
          <span>Sign up</span>
        </button>
      </Link>
    </div>
  );
}