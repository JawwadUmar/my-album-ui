import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, type LoginRequest } from "../api/auth";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();

    const requestData: LoginRequest = {
      email: email,
      password: password,
    }

    try {

      //Calling the Go Backend
      const response = await login(requestData);

      console.log(response);
      

      //Extracting the Response from Backend [token]
      const {token} = response.data;

      if (!token) {
         throw new Error("No token received from server");
      }

      //Store the real token in localStorage
      localStorage.setItem("token", token);
      toast.success('🦄 Login Sucessful');
      navigate("/");
      
    } catch (error) {
        if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Login failed";
        toast.error(message);
      }

      else if(error instanceof Error){
        toast.error(error.message);
      }
      
      else {
        toast.error("An unexpected error occurred");
      }
    }
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