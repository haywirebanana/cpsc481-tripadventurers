import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import '../styles/TopNav.css';
import back from "../assets/backarrow.png";
import logout from "../assets/logout.png";

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSetupPage = location.pathname.includes('/trip-setup');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('authToken');
    setShowLogoutModal(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
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
          onClick={handleLogoutClick}
          className="btn-logout"
        >
          <img src={logout} alt="Logout" />
        </button>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay-logout" onClick={cancelLogout}>
          <div className="modal-content-logout" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title-logout">Logout</h3>
            <p className="modal-message-logout">
              Are you sure you want to logout?
            </p>
            <div className="modal-actions-logout">
              <button 
                className="modal-btn-logout modal-btn-cancel-logout"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button 
                className="modal-btn-logout modal-btn-confirm-logout"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}