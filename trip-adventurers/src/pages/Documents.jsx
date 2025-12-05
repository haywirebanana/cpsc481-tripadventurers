import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/Documents.css";

import weather from "../assets/sundoc.svg"; 
import members from "../assets/memberdoc.svg";
import settings from "../assets/settingsdoc.svg";

export default function Documents() {
  const location = useLocation();
  const isSubPage = location.pathname.includes("/documents/");

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

        <Link to="settings" className="doc-menu-btn">
          <img src={settings} alt="Settings" className="doc-icon" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}