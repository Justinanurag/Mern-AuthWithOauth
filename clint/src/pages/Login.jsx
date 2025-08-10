import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContest } from "../context/appContest";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContest);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (state === "Sign Up" && !name)) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!backendUrl) {
      toast.error("Backend URL is not configured");
      console.error("Backend URL is undefined");
      return;
    }
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;
      let response;

      if (state === "Sign Up") {
        response = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
      } else {
        response = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
      }

      if (response.data.success) {
        //console.log("Navigating to /home");
        setIsLoggedin(true);
        toast.success("Login Successfully!");
        getUserData();
        navigate("/");
      } else {
        toast.error(response.data.message || `${state} failed`);
      }
    } catch (error) {
      console.error("Error during authentication:", { email, name, error });
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="App logo"
        className="absolute left-5 top-5 w-28 sm:w-32 cursor-pointer sm:left-10 md:left-20"
        onClick={() => navigate("/")}
      />
      <div className="bg-slate-900 p-8 sm:p-10 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md text-indigo-300">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          {state === "Sign Up"
            ? "Create your account to get started"
            : "Login to access your account"}
        </p>
        <form onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="Person icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="Email icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="Lock icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="button"
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 hover:text-indigo-400 text-sm underline cursor-pointer"
          >
            Forgot password?
          </button>
          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200 cursor-pointer"
          >
            {state}
          </button>
        </form>
        <p className="text-gray-400 text-center text-xs mt-4">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
            className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
          >
            {state === "Sign Up" ? "Login here" : "Sign Up"}
          </button>
        </p>
        <button
          onClick={() => {
            window.location.assign(`${backendUrl}/api/auth/google`);
          }}
          type="button"
          className="mt-6 flex items-center justify-center gap-3 w-full px-8 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-slate-800 font-medium text-sm shadow-md hover:bg-gradient-to-r hover:from-indigo-100 hover:to-indigo-200 hover:text-indigo-900 hover:scale-105 hover:shadow-lg transition-all duration-300 dark:from-slate-100 dark:to-slate-200 dark:hover:from-indigo-200 dark:hover:to-indigo-300 dark:hover:text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
          aria-label="Sign in with Google"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="h-6 w-6"
            loading="lazy"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
