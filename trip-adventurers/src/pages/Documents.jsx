import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Documents.css";

import weather from "../assets/sundoc.svg"; 
import members from "../assets/memberdoc.svg";
import logout from "../assets/logout.png";

export default function Documents() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSubPage = location.pathname.includes("/documents/");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isReadOnly = location.state?.readOnly || false;

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

  if (isSubPage) {
    return <Outlet context={{ readOnly: isReadOnly }} />;
  }

  return (
    <>
      <div className="documents-page">
        <div className="documents-menu">
          <Link to="weather" state={{ readOnly: isReadOnly }} className="doc-menu-btn">
            <img src={weather} alt="Weather" className="doc-icon" />
            <span>Weather and News</span>
          </Link>

          <Link to="members" state={{ readOnly: isReadOnly }} className="doc-menu-btn">
            <img src={members} alt="Members" className="doc-icon" />
            <span>{isReadOnly ? 'View Members' : 'Manage Members'}</span>
          </Link>

          <button onClick={handleLogoutClick} className="doc-menu-btn logout-btn">
            <img src={logout} alt="Logout" className="doc-icon" />
            <span>Logout</span>
          </button>
        </div>
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