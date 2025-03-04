"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Search, Eye, Download, Trash, User, LogOut } from "lucide-react";

export default function AcceptanceLetterPage() {
  const [appliedLetters, setAppliedLetters] = useState<
    { date: string; number: string; nim: string }[]
  >([]);
  const { username } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [entriesToShow, setEntriesToShow] = useState(5);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showLetterDropdown, setShowLetterDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setShowLogoutPopup(false);
    router.push("/login");
  };

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

  // Fetch applied letters from API or local storage
  useEffect(() => {
    const fetchAppliedLetters = async () => {
      const response = await fetch("/api/appliedLetters"); // Replace with actual API
      const data = await response.json();
      setAppliedLetters(data);
    };

    fetchAppliedLetters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex items-center">
        <div className="flex items-center">
          <img
            src="/logo-humic-text.png"
            alt="HUMIC Engineering"
            className="h-17 mr-3"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-[47px] ml-[47px] ">
          <a
            href="/homepage"
            className="text-gray-700 hover:bg-red-200 px-3 py-2 rounded-md"
          >
            Home
          </a>

          {/* Letter Button with Dropdown */}
          <div className="relative">
            <button
              id="letter-button"
              onClick={() => setShowLetterDropdown(!showLetterDropdown)}
              className="text-[#B4262A] border-b-2 border-[#B4262A] pb-1 px-4 py-2 
             hover:bg-gray-200 hover:rounded-lg hover:rounded-b-none 
             transition-all duration-200 cursor-pointer"
            >
              Letter
            </button>

            {showLetterDropdown && (
              <div
                id="letter-dropdown"
                className="absolute mt-1 bg-white shadow-md rounded-md w-48 z-50 transition-all duration-200"
              >
                <button
                  onClick={() => router.push("/letter/acceptanceletter")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                >
                  Acceptance Letter
                </button>
                <button
                  onClick={() => router.push("/letter/completionletter")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                >
                  Completion Letter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Button */}
        <div className="ml-auto relative">
          <button
            id="profile-button"
            onClick={() => setShowProfile(!showProfile)}
            className="text-gray-500 text-2xl cursor-pointer p-2 hover:bg-gray-200 rounded-full"
          >
            <User />
          </button>

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

      {/* Page Content */}
      <div className="pl-20 pr-20 pt-10">
        <h1 className="text-3xl text-black">
          Practical Work Acceptance Letter
        </h1>

        {/* Content Box (Buttons + Table) */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          {/* Buttons & Search */}
          <div className="flex justify-between items-start mb-4">
            {/* Left - Buttons + Entries */}
            <div className="flex flex-col space-y-3">
              {/* Buttons Side by Side */}
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    router.push("/letter/acceptanceletter/applyLetter")
                  }
                  className="bg-[#2c2c2c] text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Apply letter
                </button>
                <button className="bg-[#2c2c2c] text-white px-4 py-2 rounded-md ">
                  View template
                </button>
              </div>

              {/* Show Entries Dropdown Below Buttons */}
              <div className="flex items-center space-x-2">
                <span className="text-black">Show</span>
                <select
                  className="border border-black rounded px-2 py-1 bg-white text-black"
                  value={entriesToShow}
                  onChange={(e) => setEntriesToShow(Number(e.target.value))}
                >
                  {[5, 10, 15, 20, 25, 30].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span className="text-black">entries</span>
              </div>
            </div>

            {/* Right - Search */}
            <input
              type="text"
              placeholder="Search..."
              className="border px-3 py-2 rounded-md text-black"
            />
          </div>

          {/* Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <table className="w-full border border-black border-collapse">
              <thead>
                <tr className="bg-gray-200 text-black font-normal">
                  <th className="px-4 py-2 text-center border border-black w-1/4">
                    Submission date
                  </th>
                  <th className="px-4 py-2 text-center border border-black w-1/4">
                    Letter number
                  </th>
                  <th className="px-4 py-2 text-center border border-black w-1/4">
                    NIM
                  </th>
                  <th className="px-4 py-2 text-center border border-black w-1/4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {appliedLetters.length > 0 ? (
                  appliedLetters.map((letter, index) => (
                    <tr key={index} className="border border-black text-black">
                      <td className="px-4 py-2 border border-black w-1/4">
                        {letter.date}
                      </td>
                      <td className="px-4 py-2 border border-black w-1/4">
                        {letter.number}
                      </td>
                      <td className="px-4 py-2 border border-black w-1/4">
                        {letter.nim}
                      </td>
                      <td className="px-4 py-2 border border-black w-1/4">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-md"
                            disabled
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-green-500 hover:bg-green-100 rounded-md"
                            disabled
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-red-500 hover:bg-red-100 rounded-md"
                            disabled
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-center border border-black text-black"
                    >
                      No applied letters yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
