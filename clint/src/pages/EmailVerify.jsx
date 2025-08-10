import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContest } from "../context/appContest";
import { useEffect } from "react";

function EmailVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContest);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, {
        email: userData.email,
        otp:otp
      });
      if (data.success) {
        toast.success("Email verification Successfully");
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message || "Email verification failed");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred during email verification"
      );
    }
  };
useEffect(()=>{
  isLoggedin && userData && userData.isAccountVerified && navigate('/')

},[isLoggedin,userData])
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 relative">
      <img
        src={assets.logo}
        alt="App logo"
        className="absolute left-5 top-5 w-28 sm:w-32 cursor-pointer sm:left-10 md:left-20"
        onClick={() => navigate("/")}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-lg shadow-2xl w-11/12 sm:w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Verify Your Email
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit OTP sent to your email
        </p>

        <input
          type="text"
          maxLength="6"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition duration-200 cursor-pointer"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;
