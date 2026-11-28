
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.get("/users", {
        params: { email: userData.email },
      });

      if (response.data.length > 0) {
        throw new Error("Email already registered");
      }

      const newUser = await api.post("/users", userData);

      return newUser.data;
    },

    onSuccess: () => {
      navigate("/login");
    },

    onError: (err) => {
      setError(
        err.message === "Email already registered"
          ? err.message
          : "Registration failed. Please try again."
      );
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

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      return setError("All fields are required");
    }

    // Email validation
    const emailRegex =
      /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

    if (
      !emailRegex.test(email) ||
      email.includes("..") ||
      email.split("@")[0].startsWith(".") ||
      email.split("@")[0].endsWith(".")
    ) {
      return setError("Please enter a valid email address");
    }

    // Password validation
    if (password.length < 8) {
      return setError("Password must contain at least 8 characters");
    }

    if (!/[A-Z]/.test(password)) {
      return setError("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      return setError("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      return setError("Password must contain at least one number");
    }

    if (!/[^A-Za-z0-9\s]/.test(password)) {
      return setError("Password must contain at least one special character");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    // Register user
    registerMutation.mutate({
      name,
      email,
      password,
      isBlocked: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl bg-gray-900 p-8 text-white"
      >
        <h1 className="text-3xl font-bold text-purple-500 text-center">
          Join BANKAI VAULT
        </h1>

        <p className="text-center text-gray-400">
          Create your account
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Password with show/hide option */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
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

        {/* Confirm Password with show/hide option */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-800 p-3 pr-12 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-lg bg-purple-600 p-3 font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          {registerMutation.isPending
            ? "Creating Account..."
            : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
