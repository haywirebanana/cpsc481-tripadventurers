import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div>
      <h1>Sign Up Page</h1>
      <Link to="/login"><button>Already have an account?</button></Link>
      <Link to="/trip-list"><button>Sign Up</button></Link>
    </div>
  );
}
