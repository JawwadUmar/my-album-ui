import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, googleLogin, type LoginRequest } from "../api/auth";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData: LoginRequest = {
      email: email,
      password: password,
    }

    try {

      //Calling the Go Backend
      const response = await login(requestData);

      console.log(response);

      const { token, user } = response.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      authLogin({ token, user });
      toast.success('🦄 Login Sucessful');
      navigate("/");

    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Login failed";
        toast.error(message);
      }

      else if (error instanceof Error) {
        toast.error(error.message);
      }

      else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed: No credential received");
      return;
    }

    try {
      const response = await googleLogin({ token: credentialResponse.credential });
      const { token, user } = response.data;

      authLogin({ token, user });
      toast.success('Login Successful');
      navigate("/");

    } catch (error) {
      console.error("Google login error:", error);
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Google login failed";
        toast.error(message);
      } else {
        toast.error("Google login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome Back 📸</h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <input
            className="w-full p-3 border rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 cursor-pointer">
            Login
          </button>
        </form>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="h-[1px] bg-gray-300 flex-1"></div>
          <span>OR</span>
          <div className="h-[1px] bg-gray-300 flex-1"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google Login Failed');
            }}
            text="continue_with"
            width="325"
          />
        </div>

        <p className="text-sm text-center mt-2">
          New here? <Link to="/signup" className="text-indigo-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;