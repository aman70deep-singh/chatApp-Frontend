import axiosPublic from "../api/axiosPublic.js";
import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const response = await axiosPublic.post(
        "http://localhost:5000/auth/login",
        {
          email,
          password,
        }
      );
      const { userInfo, token } = response.data;
      login(userInfo, token);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed"
      );
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/80 shadow-2xl rounded-2xl p-10 w-full max-w-md h-auto backdrop-blur-md"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center" style={{ color: '#25D366', textShadow: '0 1px 2px #b2f5c0' }}>Login</h2>

        {err && (
          <p className="bg-red-100 text-red-600 p-2 text-center rounded mb-3">
            {err}
          </p>
        )}

        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg" style={{ color: '#25D366' }}>
            <FaEnvelope />
          </span>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border border-green-100 pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-green-200 outline-none bg-white/70 text-gray-700 shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg" style={{ color: '#25D366' }}>
            <FaLock />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full border border-green-100 pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-white/70 text-gray-700 shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer"
            style={{ color: '#25D366' }}
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={0}
            role="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-[#25D366] text-white py-3 rounded-lg font-bold text-lg shadow-md transition hover:bg-[#1da851]"
        >
          Login
        </button>

        <div className="mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/signUp" className="font-semibold hover:underline" style={{ color: '#25D366' }}>SignUp</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
