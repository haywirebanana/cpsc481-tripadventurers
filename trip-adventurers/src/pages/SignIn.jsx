import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div>
      <h1>Sign Up Page</h1>
      <Link to="/"><button>Already have an account?</button></Link>
      <Link to="/trip-list"><button>Sign Up</button></Link>
    </div>
  );
}
