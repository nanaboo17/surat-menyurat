// Updated Homepage UI with Figma Design Style
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, CheckCircle, LogOut, User } from "lucide-react";

export default function HomePage() {
  const [acceptanceLetters, setAcceptanceLetters] = useState(0);
  const [completionLetters, setCompletionLetters] = useState(0);
  const { username } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const [showLetterDropdown, setShowLetterDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLetterCounts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "https://cetaksuratkp-api.humicprototyping.com/api/letter",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        const json = await response.json();
        const letters = json.data;

        if (Array.isArray(letters)) {
          const acceptanceCount = letters.filter(
            (letter) => letter.is_acceptance
          ).length;
          const completionCount = letters.filter(
            (letter) => letter.is_completion
          ).length;

          setAcceptanceLetters(acceptanceCount);
          setCompletionLetters(completionCount);
        } else {
          console.error("Unexpected response format", letters);
          console.log("API Response", json);
        }
      } catch (error) {
        console.error("Failed to fetch letter data:", error);
      }
    };

    fetchLetterCounts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest("#letter-dropdown") &&
        !target.closest("#letter-button")
      ) {
        setShowLetterDropdown(false);
      }
      if (
        !target.closest("#profile-dropdown") &&
        !target.closest("#profile-button")
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <img
            src="/logo-humic-text.png"
            alt="HUMIC Engineering"
            className="h-12 mr-3"
          />
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-[#B4262A] font-semibold border-b-2 border-[#B4262A]"
            >
              Home
            </a>
            <div className="relative">
              <button
                id="letter-button"
                onClick={() => setShowLetterDropdown(!showLetterDropdown)}
                className="text-gray-700 hover:text-[#B4262A] font-medium cursor-pointer transition duration-300"
              >
                Letter
              </button>

              {showLetterDropdown && (
                <div
                  id="letter-dropdown"
                  className="absolute mt-2 bg-white shadow-md rounded-md w-48 z-50"
                >
                  <button
                    onClick={() => router.push("/letter/acceptanceletter")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Acceptance Letter
                  </button>
                  <button
                    onClick={() => router.push("/letter/completionletter")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Completion Letter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-50">
          <button
            id="profile-button"
            onClick={() => setShowProfile(!showProfile)}
            className="text-gray-700 hover:text-black cursor-pointer"
          >
            <User />
          </button>
          {showProfile && (
            <div
              id="profile-dropdown"
              className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg"
            >
              <div className="p-4 bg-gray-100 text-black text-center">
                <p className="font-semibold">{username || "Guest"}</p>
              </div>
              <button
                onClick={async () => {
                  setIsLoggingOut(true);
                  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulasi delay
                  setIsLoggingOut(false);
                  router.push("/login");
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center px-4 py-2 text-sm text-black hover:bg-gray-200"
              >
                {isLoggingOut ? (
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  <LogOut className="mr-2" size={18} />
                )}
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <img
          src="assets/background.jpg"
          className="w-full h-[320px] object-cover z-0"
          alt="Background"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h1 className="text-5xl font-bold drop-shadow-lg">
            Welcome{username ? `, ${username}` : ""}!
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-10">
        {/* Letter Maker Box */}
        <div className="bg-white shadow-md rounded-lg p-6 col-span-2">
          <h2 className="text-xl font-bold text-black mb-3">Letter Maker</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            This platform allows interns at HUMIC Engineering to easily create
            and manage their internship documents, including acceptance and
            completion letters, in a fast, accurate, and secure way.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <HeartPulse className="text-yellow-500 text-4xl mx-auto mb-2" />
            <p className="text-lg font-bold text-black">{acceptanceLetters}</p>
            <p className="text-gray-600 text-sm">Acceptance letter</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <CheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
            <p className="text-lg font-bold text-black">{completionLetters}</p>
            <p className="text-gray-600 text-sm">Completion letter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
