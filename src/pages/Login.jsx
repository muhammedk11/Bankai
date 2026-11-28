
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

import api from "../services/api";
import { setCredentials } from "../store/slices/authSlice";
import { setAdmin } from "../store/slices/adminAuthSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      // First check admin account
      const adminResponse = await api.get("/admin", {
        params: { email },
      });

      const admin = adminResponse.data[0];

      if (admin) {
        if (admin.password !== password) {
          throw new Error("Invalid email or password");
        }

        return {
          role: "admin",
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
          },
        };
      }

      // If no admin exists, check customer account
      const userResponse = await api.get("/users", {
        params: { email },
      });

      const user = userResponse.data[0];

      if (!user || user.password !== password) {
        throw new Error("Invalid email or password");
      }

      if (user.isBlocked) {
        throw new Error(
          "Your account has been blocked. Please contact support."
        );
      }

      return {
        role: "customer",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    },

    onSuccess: (result) => {
      if (result.role === "admin") {
        dispatch(setAdmin(result.user));
        navigate("/admin", { replace: true });
      } else {
        dispatch(setCredentials(result.user));
        navigate("/", { replace: true });
      }
    },

    onError: (err) => {
      setError(err.message);
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();

    if (!email || !formData.password) {
      return setError("All fields are required");
    }

    loginMutation.mutate({
      email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl bg-gray-900 p-8 text-white"
      >
        <h1 className="text-3xl font-bold text-purple-500 text-center">
          Welcome Back
        </h1>

        <p className="text-center text-gray-400">
          Login to your BANKAI VAULT account
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Password input with show/hide option */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-gray-800 p-3 pr-12 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-lg bg-purple-600 p-3 font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
