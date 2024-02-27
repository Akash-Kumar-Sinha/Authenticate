import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotFound from "../utils/NotFound";

const PORT = import.meta.env.VITE_APP_SERVER_PORT || 5000;

interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  emailVerified: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("AUTHENTICATE_token");
      await axios.get(`http://localhost:${PORT}/auth/logout`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("AUTHENTICATE_token");

        if (!token) {
          const authResponse = await axios.get(
            `http://localhost:${PORT}/auth/success`,
            { withCredentials: true }
          );

          const { user: newUser, token: newToken } = authResponse.data;

          setUser(newUser);
          localStorage.setItem("AUTHENTICATE_token", newToken);

          return;
        }

        const userResponse = await axios.get(
          `http://localhost:${PORT}/auth/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { user } = userResponse.data;
        setUser(user);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    {!isLoading && (

    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-3xl font-bold mb-8">Welcome!</div>
      {user && (
        <>
          <div className="text-3xl font-bold mb-8">{user.name}</div>
          <div className="text-3xl font-bold mb-8">{user.email}</div>
        </>
      )}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogout}
      >
        Sign out
      </button>
    </div>
    )}
    </>

  );
};

export default Home;
