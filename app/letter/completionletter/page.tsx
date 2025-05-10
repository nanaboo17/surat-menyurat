"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Eye,
  Pencil,
  Download,
  Trash,
  CirclePlus,
  File,
  User,
  LogOut,
} from "lucide-react";

export default function CompletionLetterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { username } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [letters, setLetters] = useState<any[]>([]); // Default to an empty array

  const [filteredLetters, setFilteredLetters] = useState<any[]>([]);

  useEffect(() => {
    const storedLetters = localStorage.getItem("completionLetters");
    if (storedLetters) {
      console.log("Stored letters: ", storedLetters); // Add this to check if it's being fetched properly
      try {
        setLetters(JSON.parse(storedLetters));
      } catch (e) {
        console.error("Failed to parse completionLetters:", e);
      }
    }
  }, []);

  interface Letter {
    id: number;
    date: string;
    number: string;
    nim: string;
    name: string;
    program: string;
    academicYear: string;
    startDate: string;
    endDate: string;
  }

  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLetterDropdown, setShowLetterDropdown] = useState(false);

  const [selectedLetter, setSelectedLetter] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewLetter = (letter: any) => {
    setSelectedLetter(letter);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://cetaksuratkp-api.humicprototyping.com/api/letter",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const filteredData = response.data.data.filter(
          (letter: any) => letter.is_completion === 1
        );
        console.log("API response:", response.data);
        setLetters(filteredData); // Store data in letters state
      } catch (error) {
        console.error("Error fetching completion letters:", error);
      }
    };

    fetchLetters();
  }, []); // Runs only once on component mount

  useEffect(() => {
    const filtered = letters.filter((letter) => {
      const nim = letter.nomor_induk_mahasiswa
        ? letter.nomor_induk_mahasiswa.toLowerCase()
        : "";
      const nomor = letter.nomor_surat_completion
        ? letter.nomor_surat_completion.toLowerCase()
        : "";
      const search = searchQuery.toLowerCase();

      // Filter by nim and program
      const nimMatches = nim.includes(search);
      const nomorMatches = nomor.includes(search);

      return nimMatches || nomorMatches; // Only return letters that match either field
    });

    console.log("Filtered Letters:", filtered); // Log the filtered result

    setFilteredLetters(filtered); // Set filtered letters to state
  }, [letters, searchQuery]); // This will run when letters or searchQuery changes

  useEffect(() => {
    console.log("Letters State:", letters); // Add this log to check letters state
  }, [letters]);

  const handleDeleteConfirmation = (letter: any) => {
    setLetterToDelete(letter); // Store the letter to be deleted
    setShowDeleteModal(true); // Show the modal for confirmation
  };

  const handleDelete = async (letter: any) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://cetaksuratkp-api.humicprototyping.com/api/letter/${letter.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const updated = letters.filter((l) => l.id !== letter.id);
      setLetters(updated);
      localStorage.setItem("completionLetters", JSON.stringify(updated));

      console.log("Deleted successfully");
    } catch (error) {
      console.error("Failed to delete letter:", error);
      alert("Failed to delete letter. Please try again.");
    } finally {
      // Set modal visibility to false after successful delete
      setShowDeleteModal(false);
      setLetterToDelete(null);
    }
  };

  // On Completion Letter page
  const handleEditLetter = (letterData: Letter) => {
    console.log(letterData);
    router.push(
      `/letter/completionletter/applyLetter?edit=${JSON.stringify(letterData)}`
    );
  };

  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLetters = filteredLetters.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 md:px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <img src="/logo-humic-text.png" alt="Logo" className="h-12 mr-3" />
          <a
            href="/homepage"
            className="text-gray-700 hover:text-[#B4262A] font-medium cursor-pointer transition duration-300"
          >
            Home
          </a>
          <div className="relative">
            <button
              onClick={() => setShowLetterDropdown(!showLetterDropdown)}
              className="text-[#B4262A] font-semibold border-b-2 border-[#B4262A] cursor-pointer transition duration-300"
            >
              Letter
            </button>
            {showLetterDropdown && (
              <div className="absolute mt-2 bg-white shadow rounded w-48 z-10">
                <button
                  onClick={() => router.push("/letter/acceptanceletter")}
                  className="block px-4 py-2 text-left w-full hover:bg-gray-100 cursor-pointer"
                >
                  Acceptance Letter
                </button>
                <button
                  onClick={() => router.push("/letter/completionletter")}
                  className="block px-4 py-2 text-left w-full hover:bg-gray-100 cursor-pointer"
                >
                  Completion Letter
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)}>
            <User />
          </button>
          {showProfile && (
            <div
              id="profile-dropdown"
              className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50"
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

      {/* Content */}
      <div className="px-4 md:px-20 py-10">
        <h1 className="text-2xl font-semibold text-black mb-1">
          Practical Work Completion Letter
        </h1>
        <p className="text-gray-500 mb-6">
          Kelola surat keterangan selesai kerja praktik mahasiswa
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => router.push("/letter/completionletter/applyLetter")}
            className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <CirclePlus size={18} /> Apply letter
          </button>
          <button
            onClick={() => router.push("/letter/completionletter/viewTemplate")}
            className="bg-white text-black border px-4 py-2 rounded flex items-center gap-2"
          >
            <File size={18} /> View template
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded-md text-sm w-full max-w-xs"
          />
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded shadow overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="py-2 px-4">Submission Date</th>
                <th className="py-2 px-4">Letter Number</th>
                <th className="py-2 px-4">NIM</th>
                <th className="py-2 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLetters.map((letter, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">
                    {new Date(letter.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{letter.nomor_surat_completion}</td>
                  <td className="py-2 px-4">{letter.nomor_induk_mahasiswa}</td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewLetter(letter)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditLetter(letter)}
                        className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirmation(letter)}
                        className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-600"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-4 text-sm">
            <span>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredLetters.length)} of{" "}
              {filteredLetters.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-2 py-1 border rounded ${
                  currentPage === 1 ? "text-gray-400" : ""
                }`}
              >
                &larr; Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-red-600 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-2 py-1 border rounded ${
                  currentPage === totalPages ? "text-gray-400" : ""
                }`}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && letterToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="font-semibold text-black text-lg">
                Delete Confirmation
              </h2>
            </div>
            <div className="px-6 py-4 text-sm text-black">
              <p>Are you sure you want to delete this letter?</p>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(letterToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedLetter && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[600px]">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="font-semibold text-black text-lg">Detail Surat</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 space-y-2 text-sm text-black">
              <div className="flex justify-between">
                <span className="font-semibold">Letter Number</span>
                <span>{selectedLetter.nomor_surat_completion}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Student Name</span>
                <span>{selectedLetter.nama_mahasiswa}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">
                  Student Identification Number
                </span>
                <span>{selectedLetter.nomor_induk_mahasiswa}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Student Study Program</span>
                <span>{selectedLetter.program_studi_mahasiswa}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Academic Year</span>
                <span>{selectedLetter.tahun_ajaran}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Starting Date</span>
                <span>{selectedLetter.start_date}</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() =>
                  router.push(
                    `/letter/completionletter/showLetter?id=${selectedLetter.id}`
                  )
                }
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
              >
                Show Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
