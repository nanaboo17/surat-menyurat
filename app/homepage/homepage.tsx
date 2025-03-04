"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { HeartPulse, CheckCircle, LogOut, User } from "lucide-react";

export default function HomePage() {
  const [acceptanceLetters, setAcceptanceLetters] = useState(12);
  const [completionLetters, setCompletionLetters] = useState(9);
  const { username } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showLetterDropdown, setShowLetterDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setShowLogoutPopup(false);
    router.push("/login");
  };

  // Close dropdowns when clicking outside
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
      <nav className="bg-white shadow-md p-4 flex justify-between items-center relative">
        <div className="flex items-center">
          <img src="/logo.png" alt="HUMIC Engineering" className="h-8 mr-2" />
          <span className="font-bold text-lg">HUMIC Engineering</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-red-500 border-b-2 border-red-500 pb-1">
            Home
          </a>

          {/* Letter Button with Dropdown */}
          <div className="relative">
            <button
              id="letter-button"
              onClick={() => setShowLetterDropdown(!showLetterDropdown)}
              className={`text-gray-700 hover:text-red-500 ${
                showLetterDropdown ? "border-b-2 border-red-500" : ""
              } pb-1`}
            >
              Letter
            </button>

            {showLetterDropdown && (
              <div
                id="letter-dropdown"
                className="absolute mt-1 bg-white shadow-md rounded-md w-48 z-50"
              >
                <button
                  onClick={() => router.push("/letter/acceptanceletter")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Acceptance Letter
                </button>
                <button
                  onClick={() => router.push("/letter/completionLetter")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Completion Letter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Button */}
        <div className="relative">
          <button
            id="profile-button"
            onClick={() => setShowProfile(!showProfile)}
            className="text-gray-500 text-2xl cursor-pointer p-2 hover:bg-gray-200 rounded-full"
          >
            <User />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div
              id="profile-dropdown"
              className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg overflow-hidden z-50"
            >
              <div className="p-4 bg-gray-200 text-black text-center">
                <p className="font-semibold">{username || "Guest"}</p>
                <p className="text-sm text-gray-600">1234567899</p>
              </div>
              <button
                onClick={() => setShowLogoutPopup(true)}
                className="flex items-center w-full px-4 py-2 text-black hover:bg-gray-100"
              >
                <LogOut className="mr-2" size={18} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-10 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-black">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="text-center py-16 bg-white shadow-md">
        <h1 className="text-4xl font-bold text-black">Welcome,</h1>
        <p className="text-black text-lg">{username ? username : "Guest"}!</p>
      </div>

      {/* Statistics Section */}
      <div className="flex justify-center space-x-8 py-10">
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-48">
          <HeartPulse className="text-red-500 text-4xl mx-auto" />
          <h2 className="text-xl font-semibold mt-2">{acceptanceLetters}</h2>
          <p className="text-gray-600">Acceptance Letter</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-48">
          <CheckCircle className="text-red-500 text-4xl mx-auto" />
          <h2 className="text-xl font-semibold mt-2">{completionLetters}</h2>
          <p className="text-gray-600">Completion Letter</p>
        </div>
      </div>
    </div>
  );
}
