import { Link, Outlet } from "react-router-dom";

export default function Documents() {
  return (
    <div>
      <h2>Documents</h2>

      <div>
        <Link to="manage">Manage Documents</Link>
        <Link to="members">Manage Members</Link>
        <Link to="settings">Settings</Link>
        <Link to="weather">Weather</Link>
      </div>

      <Outlet /> {/* Renders selected document subpage */}
    </div>
  );
}
