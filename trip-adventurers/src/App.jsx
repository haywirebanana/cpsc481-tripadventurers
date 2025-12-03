import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import PhoneFrame from "./layouts/PhoneFrame";
import "./styles/App.css";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
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
    <Router basename="/cpsc481-tripadventurers">
      <PhoneFrame>
        <Routes>
          {/* Add a redirect from root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* AUTH PAGES */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Rest of your routes... */}
          <Route element={<TripListLayout />}>
            <Route path="/trip-list" element={<TripList />} />
            <Route path="/trip-setup" element={<TripSetup />} />
          </Route>

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