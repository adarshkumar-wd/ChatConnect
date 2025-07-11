import React, { useState } from 'react'
import { IoIosOptions } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { IoMdArrowBack , IoMdSettings , IoMdNotifications } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function NavBar() {

  const user = JSON.parse(localStorage.getItem("user"))
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="flex justify-between items-center h-16 md:h-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-16 h-16 overflow-hidden rounded-full border-2 border-indigo-500 shadow-md">
            <img
              className="w-full h-full object-cover"
              src="src/assets/chat_app.jpg"
              alt="Chat App Logo"
            />
          </div>
          <span className="ml-3 text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ChatSphere
          </span>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSideBarOpen(true)}
          className="md:hidden p-2 rounded-full hover:bg-indigo-50 transition-colors"
        >
          <IoIosOptions className="w-6 h-6 text-indigo-600" />
        </button>

        {/* Desktop Profile */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <p className="font-semibold text-gray-800">{user.name}</p>
            <span className="text-xs text-green-600 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              Online
            </span>
          </div>
          <div className="w-12 h-12 border-2 border-indigo-300 rounded-full overflow-hidden shadow-sm">
            <img
              className="w-full h-full object-cover"
              src={user.avatar}
              alt={user.name}
            />
          </div>
          <button
            onClick={() => navigate("/logout")}
            className="ml-2 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <CiLogout className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar with Backdrop */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsSideBarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Content */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-4/5 max-w-sm bg-white shadow-xl transition-all duration-300 ease-in-out transform ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-indigo-300 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
              </div>
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>
            <button
              onClick={() => setIsSideBarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <IoMdArrowBack className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 py-8 flex flex-col">
            <div className="mb-auto">
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-indigo-50 cursor-pointer">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <IoMdSettings className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-700">Settings</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-indigo-50 cursor-pointer">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <IoMdNotifications className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-700">Notifications</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/logout")}
              className="mt-auto flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <CiLogout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar