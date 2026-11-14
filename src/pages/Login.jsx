
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import api from "../services/api";
import { setCredentials } from "../store/slices/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await api.get("/users", {
        params: { email },
      });

      const user = response.data[0];

      if (!user || user.password !== password) {
        throw new Error("Invalid email or password");
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    },

    onSuccess: (user) => {
      dispatch(setCredentials(user));
      navigate("/");
    },

    onError: (err) => {
      setError(
        err.message === "Invalid email or password"
          ? err.message
          : "Login failed. Please try again."
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
          className="w-full rounded-lg bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-lg bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

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
          <Link to="/register" className="text-purple-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
