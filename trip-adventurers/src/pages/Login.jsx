import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div>
      <h1>Login Page</h1>

      {/* Buttons to switch pages */}
      <Link to="/signin"><button>Go to Sign Up</button></Link>
      <Link to="/trip-list"><button>Login</button></Link>
    </div>
  );
}
