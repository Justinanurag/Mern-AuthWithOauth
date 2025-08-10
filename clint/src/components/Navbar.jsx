import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContest } from "../context/appContest";
import { toast } from "react-toastify";
import axios from "axios";
import EmailVerify from "../pages/EmailVerify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedin,backendUrl } = useContext(AppContest);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
//You can also do like this 
/*
  const handleLogout = () => {
    // Clear cookies/session if needed
    setIsLoggedin(false);
    setUserData(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };*/
 const handleLogout = async () => {
  try {
    axios.defaults.withCredentials = true;

    const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

    if (data.success) {
      setIsLoggedin(false);
      setUserData(null);  
      navigate('/login');
      toast.success("Logout Successfully")
    } else {
      toast.error(data.message || "Logout failed");
    }

  } catch (error) {
    toast.error(error?.response?.data?.message || error.message || "An error occurred during logout");
  }
};
//verify email send otp 
const handleVerifyEmail = async () => {
  try {
    axios.defaults.withCredentials = true;

    const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`,{email:userData.email});
    
    if (data.success) {
      navigate('/email-verify');
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    console.error(error);
    toast.error("Verify Email error");
  }
};



  return (
    <header className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 bg-white shadow-sm fixed top-0 left-0 z-10 ">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="App Logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* User Info / Dropdown */}
      {userData ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-blue-800 text-white px-4 py-2 rounded-full shadow-sm focus:outline-none cursor-pointer"
            title={`Logged in as ${userData.name}`}
            aria-label="User menu"
          >
            <div className="w-8 h-8 flex justify-center items-center rounded-full bg-white text-gray-800 font-bold uppercase">
              {userData.name[0]}
            </div>
            <span className="text-sm font-medium whitespace-nowrap">
              {userData.name}
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {!userData.isAccountVerified && <button
                onClick={handleVerifyEmail}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-green-800 cursor-pointer"
              >
                Verify Email
              </button>}
           
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-200"
          aria-label="Login to your account"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow icon" className="w-4 h-4" />
        </button>
      )}
    </header>
  );
};

export default Navbar;
