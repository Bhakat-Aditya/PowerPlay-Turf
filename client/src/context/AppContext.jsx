import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
// 1. REMOVED the incorrect import
// import { getToken } from "@clerk/clerk-sdk-node";
import { toast } from "react-hot-toast"; // Ensure you have installed 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();
  const { user } = useUser();

  // 2. FIXED: Destructure 'getToken' from useAuth()
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);

  const fetchUser = async () => {
    try {
      // 3. FIXED: Get the token correctly using the hook function
      const token = await getToken();

      // 4. FIXED: Destructure { data } from axios response
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsOwner(data.role === "owner");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching user data");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  // 5. Pass getToken in the value so other components can use it
  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
