import { Outlet, Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function TripLayout() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* home button, fixed at top */}
      <div style={{
        flexShrink: 0,
        padding: '12px 16px',
        borderBottom: '2px solid var(--color-black)',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/trip-list">
          <button>Home</button>
        </Link>
        <h1 style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '25px',
          fontWeight: 700,
          margin: 0
        }}>Trip Name</h1>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0
      }}>
        <Outlet />   {/* Explore / Intinerary / Documents */}
      </div>

      {/* Bottom nav fixed at bottom, to fix the scrolling problem */}
      <div style={{
        flexShrink: 0,
        borderTop: '2px solid var(--color-black)',
        background: 'var(--color-bg)',
        padding: '12px'
      }}>
        <BottomNav />
      </div>
    </div>
  );
}