"use client";
import { useState, useEffect } from "react";
import { isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, User, LogOut } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function ApplyLetter() {
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();
  const { username } = useAuth();
  const [letterScope, setLetterScope] = useState("");
  const [letterNumber, setLetterNumber] = useState("");
  const [addressedTo, setAddressedTo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [studyProgram, setStudyProgram] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [academicYear, setAcademicYear] = useState("");
  const [startDate, setStartDate] = useState<Date>();

  const [endDate, setEndDate] = useState<Date>();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLetterDropdown, setShowLetterDropdown] = useState(false);

  useEffect(() => {
    const editParam = searchParams.get("edit");
    if (editParam) {
      try {
        const parsed = JSON.parse(editParam);
        setIsEditMode(true);
        setEditId(parsed.id);
        setLetterNumber(parsed.nomor_surat_completion);
        setStudentID(parsed.nomor_induk_mahasiswa ?? "");
        setStartDate(new Date(parsed.start_date));
        setEndDate(new Date(parsed.completion_date));
        setLetterScope(parsed.letter_scope?.toLowerCase() ?? "");
        setAddressedTo(parsed.address_to ?? "");
        setStudyProgram(parsed.program_studi_mahasiswa);
        setAcademicYear(parsed.tahun_ajaran);
        setStudentName(parsed.nama_mahasiswa);
      } catch (e) {
        console.error("Failed to parse edit param:", e);
      }
    }
  }, [searchParams]);

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

  const handleSubmit = async () => {
    if (
      !letterScope ||
      !letterNumber ||
      !addressedTo ||
      !studentName ||
      !studentID ||
      !studyProgram ||
      !academicYear ||
      !startDate ||
      !endDate
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    const formattedLetterNumber = letterNumber.padStart(3, "0");
    const formattedDate = format(new Date(), "dd.MM.yyyy");
    const formattedLetter = `HUMIC/${
      letterScope.toUpperCase() === "INTERNAL" ? "INT" : "EXT"
    }/${formattedDate}/${formattedLetterNumber}`;

    const requestData = {
      nama_mahasiswa: studentName,
      letter_scope: letterScope,
      nomor_surat_acceptance: "-",
      nomor_surat_completion: formattedLetter,
      address_to: addressedTo,
      nomor_induk_mahasiswa: studentID,
      program_studi_mahasiswa: studyProgram,
      tahun_ajaran: academicYear,
      start_date: format(startDate, "yyyy-MM-dd"),
      completion_date: format(endDate, "yyyy-MM-dd"),
      is_completion: 1,
    };

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Unauthorized! Please log in.");
        return;
      }

      console.log("Submitting data:", requestData);

      let response;
      if (isEditMode) {
        response = await axios.put(
          `https://cetaksuratkp-api.humicprototyping.com/api/letter/${editId}`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "https://cetaksuratkp-api.humicprototyping.com/api/letter",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      }

      if (response.data.success) {
        console.log("Letter submitted successfully:", response.data);
        router.push("/letter/completionletter");
      } else {
        alert(response.data.message || "Submission failed");
      }
    } catch (error: unknown) {
      console.error("Error submitting letter:", error);
      if (axios.isAxiosError(error)) {
        // Now TypeScript knows this is an AxiosError
        console.error("Server response:", error.response?.data);
        alert(
          `Error: ${
            error.response?.data.message || JSON.stringify(error.response?.data)
          }`
        );
      } else {
        alert("Error submitting letter. Please try again later.");
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-10 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/logo-humic-text.png"
            alt="HUMIC Engineering"
            className="h-12 mr-3"
          />
          <div className="flex space-x-8">
            <a
              href="/homepage"
              className="text-gray-700 hover:text-[#B4262A] font-medium"
            >
              Home
            </a>
            <div className="relative">
              <button
                id="letter-button"
                onClick={() => setShowLetterDropdown(!showLetterDropdown)}
                className="text-[#B4262A] border-b-2 border-[#B4262A]"
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

        <div className="relative">
          <button
            id="profile-button"
            onClick={() => setShowProfile(!showProfile)}
            className="text-gray-700 hover:text-black"
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

      <div className="px-20 py-10">
        <h1 className="text-2xl font-semibold text-black mb-8">
          {isEditMode
            ? "Update Completion Work Letter"
            : "Apply Completion Work Letter"}
        </h1>

        <div className="bg-white rounded-lg p-8 shadow-md">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-black block mb-1">Letter Scope</label>
              <Select
                value={letterScope}
                onValueChange={setLetterScope}
                disabled={isEditMode}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-black block mb-1">Letter Number</label>
              <Input
                value={letterNumber ?? ""}
                onChange={(e) => setLetterNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="text-black block mb-1">Addressed To</label>
              <Input
                value={addressedTo ?? ""}
                onChange={(e) => setAddressedTo(e.target.value)}
                disabled={isEditMode}
              />
            </div>
            <div>
              <label className="text-black block mb-1">Student Name</label>
              <Input
                value={studentName ?? ""}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-black block mb-1">
                Student Identification Number (NIM)
              </label>
              <Input
                value={studentID ?? ""}
                onChange={(e) => setStudentID(e.target.value)}
              />
            </div>
            <div>
              <label className="text-black block mb-1">
                Student Study Program
              </label>
              <Input
                value={studyProgram ?? ""}
                onChange={(e) => setStudyProgram(e.target.value)}
              />
            </div>
            <div>
              <label className="text-black block mb-1">Academic Year</label>
              <Input
                value={academicYear ?? ""}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </div>
            <div>
              <label className="text-black block mb-1">Starting Date</label>
              <div className="relative">
                <Input
                  value={
                    startDate && isValid(startDate)
                      ? format(startDate, "yyyy-MM-dd")
                      : ""
                  }
                  placeholder="Select Start Date"
                  readOnly
                  className="pr-10"
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                />
                <CalendarIcon
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                />
                {showStartCalendar && (
                  <DayPicker
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setShowStartCalendar(false);
                    }}
                    className="absolute z-10 mt-2 bg-white border rounded shadow"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="text-black block mb-1">
                Date of Completion
              </label>
              <div className="relative">
                <Input
                  value={
                    endDate && isValid(endDate ?? new Date())
                      ? format(endDate, "yyyy-MM-dd")
                      : ""
                  }
                  placeholder="Select End Date"
                  readOnly
                  className="pr-10"
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                />
                <CalendarIcon
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                />
                {showEndCalendar && (
                  <DayPicker
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setShowEndCalendar(false);
                    }}
                    className="absolute z-10 mt-2 bg-white border rounded shadow"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <Button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700"
            >
              {isEditMode ? "Update Letter" : "Submit"}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
