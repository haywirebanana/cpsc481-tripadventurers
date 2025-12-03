import { Link, useLocation } from "react-router-dom";
import "../styles/BottomNav.css";

import explore from "../assets/explore.png"; 
import itinerary from "../assets/itineraryy.png";
import documents from "../assets/docss.png";

export default function BottomNav() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <nav className="bottom-nav"><Link to="explore" className={`nav-item ${isActive('/explore') ? 'active' : ''}`}>
        <img src={explore} alt="Explore" className="nav-icon" />
        <span>Explore</span>
      </Link>

      <Link to="intinerary" className={`nav-item ${isActive('/intinerary') ? 'active' : ''}`}>
        <img src={itinerary} alt="Itinerary" className="nav-icon" />
        <span>Itinerary</span>
      </Link>

      <Link to="documents" className={`nav-item ${isActive('/documents') ? 'active' : ''}`}>
        <img src={documents} alt="Documents" className="nav-icon" />
        <span>Documents</span>
      </Link>
    </nav>
  );
}