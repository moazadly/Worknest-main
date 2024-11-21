import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "./AuthContext";
import axios from "axios";

interface User {
  username: string;
  email: string;
  avatar: string;
  currentWorkspace: string;
}
interface UpdatedUser {
  username: string;
  email: string;
  password: string;
  currentWorkspace: string;
}
interface UserState {
  userData: User | "loading" | null;
  userWorkspace: string | null;
  setUserData: (user: User | null) => void;
  setUserWorkspace: (userWorkspace: string) => void;
  updateUser: (user: UpdatedUser) => void;
}

export let userContext = createContext<UserState | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useAppContext must be used within an UserContextProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserProviderProps> = ({
  children,
}) => {
  const { token } = useAuthContext();
  const [userData, setUserData] = useState<User | "loading" | null>(null);
  const [userWorkspace, setUserWorkspace] = useState<string | null>(null);
  const updateUser = async (user: UpdatedUser) => {
    try {
      const response = await axios.put(
        `https://worknest-server-eight.vercel.app/api/user`,
        user,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { username, email, avatar, currentWorkspace } = response.data; // Destructure the response data

      setUserData({ username, email, avatar, currentWorkspace }); // Set the user data in state
      setUserWorkspace(currentWorkspace);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null); // Reset user data if there is an error
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setUserData("loading");
      try {
        const response = await axios.get(
          `https://worknest-server-eight.vercel.app/api/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { username, email, avatar, currentWorkspace } = response.data; // Destructure the response data

        setUserData({ username, email, avatar, currentWorkspace }); // Set the user data in state
        setUserWorkspace(currentWorkspace);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null); // Reset user data if there is an error
      }
    };

    if (token) {
      fetchUserData(); // Call the async function
    } else {
      setUserData(null);
    }
  }, [token]);

  return (
    <userContext.Provider
      value={{
        userData,
        setUserData,
        setUserWorkspace,
        userWorkspace,
        updateUser,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
