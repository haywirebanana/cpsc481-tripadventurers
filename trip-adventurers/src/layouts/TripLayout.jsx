import { Outlet, Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function TripLayout() {
  return (
    <div>
      {/* Home button */}
      <Link to="/trip-list"><button>Home</button></Link>

      <Outlet />   {/* Explore / Intinerary / Documents */}

      <BottomNav />  {/* Only for trip pages */}
    </div>
  );
}
