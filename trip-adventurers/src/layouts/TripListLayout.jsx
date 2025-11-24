import { Outlet } from "react-router-dom";
import TopNav from "../components/TopNav";

export default function TripListLayout() {
  return (
    <div>
      <TopNav />
      <Outlet />
    </div>
  );
}