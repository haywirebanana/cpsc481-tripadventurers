import { Link } from "react-router-dom";

export default function TripList() {
  return (
    <div>
      <h1>Trip List</h1>
      <Link to="/trip-setup"><button>Manage / Add Trip</button></Link>
      <Link to="/trip/1/explore"><button>Enter Trip 1</button></Link>
      <Link to="/trip/2/explore"><button>Enter Trip 2</button></Link>
    </div>
  );
}
