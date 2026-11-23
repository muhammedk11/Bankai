
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { setAdmin } from "../../store/slices/adminAuthSlice";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Login request
  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await api.get("/admin", {
        params: { email },
      });

      const admin = response.data[0];

      if (!admin || admin.password !== password) {
        throw new Error("Invalid email or password");
      }

      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      };
    },

    onSuccess: (admin) => {
      dispatch(setAdmin(admin));
      navigate("/admin");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090f] px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#15151f] p-8">

        <h1 className="text-3xl font-bold text-white text-center">
          BANKAI
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Admin Panel Login
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              className="w-full rounded-lg bg-[#09090f] border border-white/10 p-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full rounded-lg bg-[#09090f] border border-white/10 p-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          {loginMutation.isError && (
            <p className="text-red-400 text-sm">
              {loginMutation.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-purple-600 p-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
