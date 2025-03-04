"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import axios from "axios";

export default function AcceptanceWorkLetter() {
  const { username } = useAuth();
  const router = useRouter();

  const [letterScope, setLetterScope] = useState("");
  const [letterNumber, setLetterNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [studyProgram, setStudyProgram] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showEndCalendar, setEndShowCalendar] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [addressedTo, setAddressedTo] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showLetterDropdown, setShowLetterDropdown] = useState(false);
  const { User, LogOut } = require("lucide-react");

  const handleLogout = () => {
    setShowLogoutPopup(false);
    router.push("/login");
  };

  const handleSubmit = async () => {
    try {
      // Send a POST request to increment the number of acceptance letters
      await axios.post("/api/increment-acceptance-letters");
      // Redirect to the homepage or show a success message
      router.push("/homepage");
    } catch (error) {
      console.error("Failed to submit the form:", error);
    }
  };

  const handleCancel = () => {
    // Clear the form or redirect to the homepage
    router.push("/letter/acceptanceletter");
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
      <nav className="bg-white shadow-md p-4 flex items-center">
        <div className="flex items-center">
          <img
            src="/logo-humic-text.png"
            alt="HUMIC Engineering"
            className="h-17 mr-3"
          />
        </div>
        <div className="flex space-x-[47px] ml-[47px]">
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

      <div className="p-6">
        <h1 className="text-3xl text-black">
          Practical Work Acceptance Letter
        </h1>
        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <Card>
            <CardContent className="grid grid-cols-3 gap-6 p-6">
              {/* Letter Scope */}
              <div className="space-y-2">
                <label className="text-black block">Letter Scope</label>
                <Select onValueChange={setLetterScope}>
                  <SelectTrigger className="w-full border border-gray-300 rounded-md text-black bg-white shadow-sm">
                    <SelectValue placeholder="Select Scope" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
                    <SelectItem value="internal" className="text-black">
                      Internal
                    </SelectItem>
                    <SelectItem value="external" className="text-black">
                      External
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Letter Number */}
              <div className="space-y-2">
                <label className="text-black block">Letter Number</label>
                <Input
                  className="text-black w-full"
                  type="text"
                  value={letterNumber}
                  onChange={(e) => setLetterNumber(e.target.value)}
                />
              </div>

              {/* Addressed To */}
              <div className="space-y-2">
                <label className="text-black block">Addressed To</label>
                <Input
                  className="text-black w-full"
                  type="text"
                  value={addressedTo}
                  onChange={(e) => setAddressedTo(e.target.value)}
                />
              </div>

              {/* Student Name */}
              <div className="space-y-2">
                <label className="text-black block">Student Name</label>
                <Input
                  className="text-black w-full"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <label className="text-black block">
                  Student Identification Number (NIM)
                </label>
                <Input
                  className="text-black w-full"
                  type="text"
                  value={studentID}
                  onChange={(e) => setStudentID(e.target.value)}
                />
              </div>

              {/* Study Program */}
              <div className="space-y-2">
                <label className="text-black block">
                  Student Study Program
                </label>
                <Input
                  className="text-black w-full"
                  type="text"
                  value={studyProgram}
                  onChange={(e) => setStudyProgram(e.target.value)}
                />
              </div>

              {/* Academic Year */}
              <div className="space-y-2">
                <label className="text-black block">Academic Year</label>
                <Select onValueChange={setAcademicYear}>
                  <SelectTrigger className="w-full border border-gray-300 rounded-md text-black bg-white shadow-sm">
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
                    <SelectItem value="2021/2022" className="text-black">
                      2021/2022
                    </SelectItem>
                    <SelectItem value="2022/2023" className="text-black">
                      2022/2023
                    </SelectItem>
                    <SelectItem value="2023/2024" className="text-black">
                      2023/2024
                    </SelectItem>
                    <SelectItem value="2024/2025" className="text-black">
                      2024/2025
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-black block">Starting Date</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md shadow-sm bg-white p-1">
                  <Input
                    type="text"
                    value={startDate ? format(startDate, "dd MMMM yyyy") : ""}
                    readOnly
                    className="flex-1 border-none focus-visible:ring-0 text-black"
                  />
                  <Button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="p-2 hover:bg-gray-100 rounded-md"
                    variant="ghost"
                  >
                    <CalendarIcon className="h-4 w-4 text-black" />{" "}
                    {/* Replace with your calendar icon */}
                  </Button>
                </div>
                {showCalendar && (
                  <DayPicker
                    className="text-black mt-2 border border-gray-300 rounded-md shadow-md p-4 bg-white"
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setShowCalendar(false); // Close the calendar after selecting a date
                    }}
                  />
                )}
              </div>

              {/* Completion Date */}
              <div className="space-y-2">
                <label className="text-black block">Date of Completion</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md shadow-sm bg-white p-1 text-black">
                  <Input
                    type="text"
                    value={endDate ? format(endDate, "dd MMMM yyyy") : ""}
                    readOnly
                    className="flex-1 border-none focus-visible:ring-0"
                  />
                  <Button
                    onClick={() => setEndShowCalendar(!showEndCalendar)}
                    className="p-2 hover:bg-gray-100 rounded-md text-black"
                    variant="ghost"
                  >
                    <CalendarIcon className="h-4 w-4 text-gray-600" />{" "}
                    {/* Replace with your calendar icon */}
                  </Button>
                </div>
                {showEndCalendar && ( // Use showEndCalendar here
                  <DayPicker
                    className="text-black mt-2 border border-gray-300 rounded-md shadow-md p-4 bg-white"
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setEndShowCalendar(false); // Close the calendar after selecting a date
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              onClick={handleCancel}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
