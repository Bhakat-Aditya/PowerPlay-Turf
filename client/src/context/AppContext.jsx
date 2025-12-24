import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// --- URL CONFIG ---
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
// ------------------

// 1. FIX: Add 'export' here so AdminDashboard can import it
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = "₹";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);

  const fetchUser = async () => {
    try {
      const token = await getToken();
      // Since baseURL is set above, this automatically goes to backendUrl/api/user
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsOwner(data.role === "owner");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    backendUrl,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 2. Custom Hook (Optional but good practice)
export const useAppContext = () => {
  return useContext(AppContext);
};

// 3. FIX: Default export ensures main.jsx imports work smoothly
export default AppProvider;
