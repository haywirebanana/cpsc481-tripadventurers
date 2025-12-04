import { Link, useLocation } from "react-router-dom";
import '../styles/TopNav.css';

export default function TopNav() {
  const location = useLocation();
  const isSetupPage = location.pathname.includes('/trip-setup');

  return (
    <div className="top-nav">
      {isSetupPage && (
        <Link to="/trip-list" className="back-button">
          ←
        </Link>
      )}
      <h1 className="top-nav-title">Trip Adventurers</h1>
      <Link to="/login">
        <button className="btn-logout">Logout</button>
      </Link>
    </div>
  );
}