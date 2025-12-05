import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import back from "../assets/backarrow.png";
import home from "../assets/home.png";

export default function TripLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isWeatherPage = location.pathname.includes("/documents/weather");

  const buttonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    transition: 'all 0.2s ease',
  };

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
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {isWeatherPage ? (
          <button 
            onClick={() => navigate(-1)}
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <img src={back} alt="Back" style={{ width: '28px', height: '28px', filter: 'brightness(0.2)' }} />
          </button>
        ) : (
          <Link to="/trip-list">
            <button 
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <img src={home} alt="Home" style={{ width: '28px', height: '28px', filter: 'brightness(0.2)' }} />
            </button>
          </Link>
        )}
        
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