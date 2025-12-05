import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../styles/Documents.css";

import weather from "../assets/sundoc.svg"; 
import members from "../assets/memberdoc.svg";
import logout from "../assets/logout.png";

export default function Documents() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSubPage = location.pathname.includes("/documents/");

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate("/login");
  };

  if (isSubPage) {
    return <Outlet />;
  }

  return (
    <div className="documents-page">
      <div className="documents-menu">
        <Link to="weather" className="doc-menu-btn">
          <img src={weather} alt="Weather" className="doc-icon" />
          <span>Weather and News</span>
        </Link>

        <Link to="members" className="doc-menu-btn">
          <img src={members} alt="Members" className="doc-icon" />
          <span>Manage Members</span>
        </Link>

        <button onClick={handleLogout} className="doc-menu-btn logout-btn">
          <img src={logout} alt="Logout" className="doc-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}