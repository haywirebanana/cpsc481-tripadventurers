import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TripProvider } from "./context/TripContext";

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
import ManageMembers from "./pages/documents/ManageMembers";
import Weather from "./pages/documents/Weather";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import TripListLayout from "./layouts/TripListLayout";
import TripLayout from "./layouts/TripLayout";

export default function App() {
  return (
    <Router>
      <TripProvider>
        <PhoneFrame>
          <Routes>

            {/* ROOT REDIRECT */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* AUTH PAGES */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* TRIP LIST PAGES (TOP NAV ONLY) */}
            <Route element={<TripListLayout />}>
              <Route path="/trip-list" element={<TripList />} />
              <Route path="/trip-setup" element={<TripSetup />} />
              <Route path="/trip-setup/:tripId" element={<TripSetup />} />
            </Route>

            {/* TRIP PAGES (BOTTOM NAV ONLY) */}
            <Route path="/trip/:tripId" element={<TripLayout />}>
              <Route index element={<Explore />} />
              <Route path="explore" element={<Explore />} />
              <Route path="intinerary" element={<Intinerary />} />

              <Route path="documents" element={<Documents />}>
                <Route path="members" element={<ManageMembers />} />
                <Route path="weather" element={<Weather />} />
              </Route>
            </Route>

          </Routes>
        </PhoneFrame>
      </TripProvider>
    </Router>
  );
}