import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PhoneFrame from "./components/PhoneFrame";

// Pages
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import TripList from "./pages/TripList";
import TripSetup from "./pages/TripSetup";
import Explore from "./pages/Explore";
import Intinerary from "./pages/Intinerary";
import Documents from "./pages/Documents";
import ManageDocuments from "./pages/documents/ManageDocuments";
import ManageMembers from "./pages/documents/ManageMembers";
import Settings from "./pages/documents/Settings";
import Weather from "./pages/documents/Weather";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import TripListLayout from "./layouts/TripListLayout";
import TripLayout from "./layouts/TripLayout";

export default function App() {
  return (
    <Router>
      <PhoneFrame>
        <Routes>

          {/* AUTH PAGES */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>

          {/* TRIP LIST PAGES (TOP NAV ONLY) */}
          <Route element={<TripListLayout />}>
            <Route path="/trip-list" element={<TripList />} />
            <Route path="/trip-setup" element={<TripSetup />} />
          </Route>

          {/* TRIP PAGES (BOTTOM NAV ONLY) */}
          <Route path="/trip/:tripId" element={<TripLayout />}>
            <Route index element={<Explore />} />
            <Route path="explore" element={<Explore />} />
            <Route path="intinerary" element={<Intinerary />} />

            <Route path="documents" element={<Documents />}>
              <Route path="manage" element={<ManageDocuments />} />
              <Route path="members" element={<ManageMembers />} />
              <Route path="settings" element={<Settings />} />
              <Route path="weather" element={<Weather />} />
            </Route>
          </Route>

        </Routes>
      </PhoneFrame>
    </Router>
  );
}
