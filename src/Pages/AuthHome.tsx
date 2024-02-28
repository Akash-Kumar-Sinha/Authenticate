import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import toast from "react-hot-toast";
import axios from "axios";
import Input from "../component/Input/Input";

const PORT = import.meta.env.VITE_APP_SERVER_PORT;

type Variant = "LOGIN" | "REGISTER";

const AuthHome = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const toggleVariant = useCallback(() => {
    setVariant((prevVariant) =>
      prevVariant === "LOGIN" ? "REGISTER" : "LOGIN"
    );
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const url = variant === "LOGIN" ? "/auth/signin" : "/auth/signup";
      const response = await axios.post(`http://localhost:${PORT}${url}`, data);
      sessionStorage.setItem("AUTHENTICATE_token", response.data.token);
      toast.success(response.data.message);
      navigate("/home");
    } catch (error) {
      console.error(`${variant} failed`, error);
      toast.error(`AuthHome: ${variant} went wrong!`);
    }
  };

  const socialLogin = async (action: string) => {
    console.log(action);
    try {
      if (action === "google") {
        window.open(`http://localhost:${PORT}/auth/google/callback`, "_self");
      }
      if (action === "github") {
        window.open(`http://localhost:${PORT}/auth/github`, "_self");
      }
    } catch (error) {
      console.error("Error during social action:", error);
      toast.error("An error occurred during the social action");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="border border-black max-w-md w-full p-10">
        <h1 className="font-bold text-center text-2xl text-gray-700">
          {variant === "LOGIN"
            ? "Sign in to your account"
            : "Create your account"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              label="Name"
              id="name"
              register={register}
              errors={errors}
              type="text"
            />
          )}
          <Input
            label="Email"
            id="email"
            register={register}
            errors={errors}
            type="email"
          />
          <Input
            label="Password"
            id="password"
            register={register}
            errors={errors}
            type="password"
          />
          <button
            type="submit"
            className="w-full mt-4 py-2 bg-gray-900 text-gray-100 rounded"
          >
            {variant === "LOGIN" ? "Sign In" : "Register"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-white text-gray-500">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => socialLogin("google")}
          className="w-full flex justify-center mt-12 py-2 bg-gray-900 text-gray-100 rounded"
        >
          <BsGoogle />
        </button>
        <button
          onClick={() => socialLogin("github")}
          className="w-full flex justify-center mt-2 py-2 bg-gray-900 text-gray-100 rounded"
        >
          <BsGithub />
        </button>
        <div
          onClick={toggleVariant}
          className="mt-4 text-gray-400 text-center cursor-pointer"
        >
          {variant === "LOGIN" ? "Create an Account" : "Log in"}
        </div>
      </div>
    </div>
  );
};

export default AuthHome;
