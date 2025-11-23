import { Link } from "react-router-dom";

export default function TopNav() {
  return (
    <div>
      <Link to="/trip-list"><button>Trip List</button></Link>
      <Link to="/trip-setup"><button>Trip Setup</button></Link>
    </div>
  );
}
