import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import WhiteLogo from "../Assets/White.png";
import { login } from "../services";
import { XCircleIcon } from "@heroicons/react/outline";
import { classNames } from "../utils";
import { XIcon } from "@heroicons/react/solid";
import LoaderSvg from "../Components/LoaderSvg";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  const { register, handleSubmit } = useForm();
  const [requestError, setRequestError] = useState(null);
  const [loader, setLoader] = useState(false);

  const onSubmit = (data) => {
    setLoader(true);
    setRequestError(null);
    login(data)
      .then((res) => {
        setLoader(false);
        if (res.data.success) {
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("email", res.data.data.email);
          localStorage.setItem("role", res.data.data.role);
          navigate("/");
        } else {
          setRequestError(
            res.data.error?.message || res.data.message || "Login failed"
          );
        }
      })
      .catch((err) => {
        setLoader(false);
        setRequestError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            err.message ||
            "An error occurred during login"
        );
      });
  };
  return (
    <>
      <main className="relative h-screen">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96">
            <div className="flex items-center justify-start">
              <img src={WhiteLogo} alt="logo" className="w-52 mx-auto" />
            </div>

            {requestError && (
              <div className="flex justify-between items-center rounded-md bg-red-50 p-4 my-4">
                <div className="flex gap-2">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-medium text-red-800">
                    {requestError}
                  </h3>
                </div>
                <XIcon
                  className="h-3 w-3 text-red-900 hover:cursor-pointer"
                  aria-hidden="true"
                  onClick={() => setRequestError(null)}
                />
              </div>
            )}

            <div className="flex items-center justify-start my-1 w-full">
              {/* Prevent default refresh and delegate to react-hook-form */}
              <form
                id="login"
                className="w-full p-4 bg-gray-800 rounded-xl"
                onSubmit={() => {
                  handleSubmit(onSubmit)();
                }}
              >
                <div className="flex items-center justify-start my-3 w-full">
                  <h1 className="text-white text-center text-2xl w-full">
                    Login{" "}
                  </h1>
                </div>
                <div className="m-3">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="current-email"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 px-4 rounded-full py-2 leading-tight"
                    placeholder="Email Address"
                    {...register("email", { required: true })}
                  />
                </div>
                <div className="m-3">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 px-4 rounded-full py-2 leading-tight"
                    placeholder="Password"
                    {...register("password", { required: true })}
                  />
                </div>
                <div className="m-3">
                  <button
                    type="submit"
                    disabled={loader}
                    className={classNames(
                      loader
                        ? "cursor-not-allowed bg-blue-300"
                        : "cursor-pointer bg-blue-600 hover:shadow-inner hover:shadow-blue-900",
                      "w-full py-2 px-4 text-white font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center justify-center"
                    )}
                  >
                    Login
                    {loader && <LoaderSvg />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
