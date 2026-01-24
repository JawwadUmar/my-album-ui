import { useState } from "react";
import { useNavigate, Link } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("token", "demo-token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back 📸</h1>
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
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">
          Login
        </button>
        <p className="text-sm text-center mt-4">
          New here? <Link to="/signup" className="text-indigo-600">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;