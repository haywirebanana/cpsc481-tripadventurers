import { Outlet } from "react-router-dom";
import TopNav from "../components/TopNav";

export default function TripListLayout() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* top nav fixed at top */}
      <div style={{
        flexShrink: 0,
        borderBottom: '2px solid var(--color-black)',
        background: 'var(--color-bg)',
        padding: '12px',
        zIndex: 10
      }}>
        <TopNav />
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0,
        position: 'relative'
      }}>
        <Outlet />
      </div>
    </div>
  );
}