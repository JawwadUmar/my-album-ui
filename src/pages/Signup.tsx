// pages/Signup.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { signup, type SignUpRequest} from "../api/auth";
import { isAxiosError } from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async(e: React.FormEvent) => {
    e.preventDefault();
      const requestData :SignUpRequest = {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
      };

      try{
        await signup(requestData);
        alert("Signup successful! Please login.");
        navigate("/login");
      }

      catch(error){
        if (isAxiosError(error)) {
        // Axios stores the backend response in error.response.data
        const message = error.response?.data?.message || "Signup failed";
        alert(message);
      } else {
        alert("An unexpected error occurred");
      }
      }
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

        <input
          type="text"
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          className="w-full mb-4 p-3 border rounded-lg"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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