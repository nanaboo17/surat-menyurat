"use client";

import { Search, Eye, Power, Trash } from "lucide-react";

export default function AcceptanceLetterPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="HUMIC Engineering" className="h-8 mr-2" />
          <span className="font-bold text-lg">HUMIC Engineering</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-red-500">
            Home
          </a>
          <a href="#" className="text-red-500 border-b-2 border-red-500 pb-1">
            Letter
          </a>
        </div>
        <img
          src="/profile.jpg"
          alt="Profile"
          className="h-10 w-10 rounded-full object-cover"
        />
      </nav>

      {/* Page Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-black">
          Practical Work Acceptance Letter
        </h1>

        {/* Buttons */}
        <div className="mt-4 flex space-x-4">
          <button className="bg-black text-white px-4 py-2 rounded-md cursor-not-allowed opacity-70">
            Apply letter
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-md cursor-not-allowed opacity-70">
            View template
          </button>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          {/* Entries & Search */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select className="border rounded px-2 py-1">
                <option>3</option>
              </select>
              <span>entries</span>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="border px-3 py-2 rounded-md"
            />
          </div>

          {/* Table Content */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="px-4 py-2 text-left">Submission date</th>
                <th className="px-4 py-2 text-left">Letter number</th>
                <th className="px-4 py-2 text-left">NIM</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">20 September 2024</td>
                  <td className="px-4 py-2">HUMIC/INT/20.9.2024/070</td>
                  <td className="px-4 py-2">1301213203</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button className="p-2 bg-gray-300 rounded-md cursor-not-allowed">
                      <Search size={16} />
                    </button>
                    <button className="p-2 bg-gray-300 rounded-md cursor-not-allowed">
                      <Power size={16} />
                    </button>
                    <button className="p-2 bg-gray-300 rounded-md cursor-not-allowed">
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span>Showing 1 to 4 of 4 entries</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-200 rounded-md cursor-not-allowed">
                &larr; Previous
              </button>
              <button className="px-3 py-1 bg-black text-white rounded-md">
                1
              </button>
              <button className="px-3 py-1 bg-gray-200 rounded-md">2</button>
              <button className="px-3 py-1 bg-gray-200 rounded-md">3</button>
              <button className="px-3 py-1 bg-gray-200 rounded-md">
                &rarr; Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
