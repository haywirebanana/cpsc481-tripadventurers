import { Link, useLocation, useNavigate } from "react-router-dom";
import '../styles/TopNav.css';
import back from "../assets/backarrow.png";
import logout from "../assets/logout.png";

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSetupPage = location.pathname.includes('/trip-setup');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate("/login");
  };

  return (
    <div className="top-nav">
      {isSetupPage && (
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <img src={back} alt="Back" />
        </button>
      )}
      <h1 className="top-nav-title">Trip Adventurers</h1>
      <button 
        onClick={handleLogout}
        className="btn-logout"
      >
        <img src={logout} alt="Logout" />
      </button>
    </div>
  );
}