// pages/Signup.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400">
      <form className="bg-white p-8 rounded-2xl shadow-xl w-96" onSubmit={handleSignup}>
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account ✨</h1>
        <input
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700">
          Sign Up
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-pink-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;