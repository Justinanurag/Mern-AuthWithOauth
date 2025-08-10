import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContest } from "../context/appContest";

function ResetPassword() {
  const navigate = useNavigate();
  const { backendUrl, getUserData } = useContext(AppContest);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email,
      });

      if (data.success) {
        toast.success("OTP sent to your email successfully.");
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred while sending the OTP."
      );
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("Please enter a new password with at least 6 characters.");
      return;
    }

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (data.success) {
        toast.success("Password reset successful!");

        if (typeof getUserData === "function") {
          getUserData();
        }

        navigate("/");
      } else {
        toast.error(data.message || "OTP verification failed.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred during OTP verification."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 relative">
      <img
        src={assets.logo}
        alt="App logo"
        className="absolute left-5 top-5 w-28 sm:w-32 cursor-pointer sm:left-10 md:left-20"
        onClick={() => navigate("/")}
      />

      <form
        onSubmit={step === 1 ? handleEmailSubmit : handleOtpSubmit}
        className="bg-slate-900 p-8 rounded-lg shadow-2xl w-11/12 sm:w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          {step === 1 ? "Reset your password" : "Verify OTP"}
        </h1>

        {step === 1 ? (
          <>
            <p className="text-center mb-6 text-indigo-300">
              Enter your registered Email
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.mail_icon} alt="" className="w-4 h-4" />
              <input
                type="email"
                placeholder="Enter Your Email"
                className="bg-transparent outline-none w-full text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-center mb-6 text-indigo-300">
              Enter 6-digit code sent to{" "}
              <span className="font-medium">{email}</span>
            </p>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition duration-200"
        >
          {step === 1 ? "Send OTP" : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
