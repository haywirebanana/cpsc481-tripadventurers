import { Link } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav>
      <Link to="explore"><button>Explore</button></Link>
      <Link to="intinerary"><button>Intinerary</button></Link>
      <Link to="documents"><button>Documents</button></Link>
    </nav>
  );
}
