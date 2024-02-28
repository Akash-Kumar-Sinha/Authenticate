import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PORT = import.meta.env.VITE_APP_SERVER_PORT || 5000;

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  type: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("AUTHENTICATE_token");
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
        const token = sessionStorage.getItem("AUTHENTICATE_token");

        if (!token) {
          const authResponse = await axios.get(
            `http://localhost:${PORT}/auth/success`,
            { withCredentials: true }
          );

          const { user: newUser, token: newToken } = authResponse.data;

          setUser(newUser);
          sessionStorage.setItem("AUTHENTICATE_token", newToken);

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

  const verifyEmail = () => {
    try {
      const token = sessionStorage.getItem("AUTHENTICATE_token");

      const userResponse = axios.get(
        `http://localhost:${PORT}/auth/verifyemail`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(userResponse);
      // setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!isLoading && (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-3xl font-bold mb-8">Welcome!</div>
          {user && (
            <>
              <div className="text-3xl font-bold mb-8">{user.name}</div>
              <div className="text-3xl font-bold mb-8">{user.email}</div>
              <div className="text-lg text-gray-500 mb-8">
                {user.emailVerified ? (
                  <div>Verified user</div>
                ) : (
                  <button onClick={verifyEmail}>verify your email</button>
                )}
              </div>
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
