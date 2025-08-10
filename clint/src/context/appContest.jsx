import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContest = createContext();

export const AppContestProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data from backend
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || "Failed to fetch user data.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Error fetching user data");
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        withCredentials: true,
      });

      if (data?.success) {
        setIsLoggedin(true);
        await getUserData(); 
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoggedin(false);
      setUserData(null);
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const contextValue = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContest.Provider value={contextValue}>
      {children}
    </AppContest.Provider>
  );
};
