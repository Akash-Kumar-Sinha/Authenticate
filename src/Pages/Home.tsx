import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  type: string;
}

const SERVER_URL = import.meta.env.VITE_APP_SERVER_PAGE_URL;

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("AUTHENTICATE_token");
      await axios.get(`${SERVER_URL}/auth/logout`, {
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
          const authResponse = await axios.get(`${SERVER_URL}/auth/success`, {
            withCredentials: true,
          });

          const { user: newUser, token: newToken } = authResponse.data;

          setUser(newUser);
          sessionStorage.setItem("AUTHENTICATE_token", newToken);

          return;
        }

        const userResponse = await axios.get(`${SERVER_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

      const userResponse = axios.get(`${SERVER_URL}/auth/verifyemail`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(userResponse);
      // setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="text-3xl font-bold mb-8">Welcome!</div>
          {user && (
            <>
              <div className="text-3xl font-bold mb-8">{user.email}</div>
              <div className="text-lg mb-8">
                {user.emailVerified ? (
                  <div className="text-green-600 font-bold">Verified user</div>
                ) : (
                  <button
                    onClick={verifyEmail}
                    className="bg-transparent text-red-500 font-bold py-2 px-4 rounded"
                  >
                    Verify Your Email
                  </button>
                )}
              </div>
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign out
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
