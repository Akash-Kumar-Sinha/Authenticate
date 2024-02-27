import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col  justify-center items-center h-screen">
        <div className="text-3xl font-bold p-4">Error 404 not Found!</div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            navigate("/");
          }}
        >
          GoBack
        </button>
      </div>
    </>
  );
};

export default NotFound;
