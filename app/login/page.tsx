"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Pastikan path benar

export default function LoginPage() {
  const { setUsername } = useAuth();
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Load remembered username from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsernameInput(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = () => {
    setUsername(usernameInput);

    if (rememberMe) {
      localStorage.setItem("rememberedUsername", usernameInput);
    } else {
      localStorage.removeItem("rememberedUsername");
    }

    router.push("/homepage");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#a32020] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/background-pattern.png)" }}
      ></div>
      <div className="relative bg-white p-12 rounded-lg shadow-md w-[500px]">
        <h2 className="text-center text-2xl font-semibold mb-6 text-black">
          Log In with SSO
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black">
            Username
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black">
            Password
          </label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label className="ml-2 text-sm text-black">Remember me</label>
        </div>

        <button
          className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          onClick={handleLogin}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
