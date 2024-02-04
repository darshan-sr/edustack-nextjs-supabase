"use client";
import { login } from "./actions";
import { Suspense, useState } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { BsStack } from "react-icons/bs";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Search = () => {
    const searchParams = useSearchParams();
    const googleCallbackError = searchParams.get("error");
    return <LoginForm googleCallbackError={googleCallbackError} />;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    const error = await login(formData);
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  const LoginForm = ({ googleCallbackError }: any) => {
    return (
      <section className="bg-gray-50 h-screen  dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen ">
          <a
            href="#"
            className="flex gap-2 items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <BsStack className="text-blue-600 text-[30px] " />
            Edustack
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter Email"
                    required
                  />
                </div>
                <div>
                  <div className="flex mb-2 justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block  text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-sm  font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                {error && (
                  <div
                    className="p-2  pl-4 mb-2  text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-700 dark:text-red-400"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {googleCallbackError && !error && (
                  <div
                    className="p-2  pl-4 mb-2  text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-700 dark:text-red-400"
                    role="alert"
                  >
                    {googleCallbackError}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full text-white  bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {loading ? "Loading..." : "Sign in"}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Account not activated?{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    activate
                  </a>
                </p>

                <div className="flex items-center justify-center space-x-2">
                  <span className="h-[1.5px] bg-gray-300 dark:bg-gray-700 w-full"></span>
                  <span className="font-normal text-gray-500 text-sm px-2 dark:text-gray-400">
                    or
                  </span>
                  <span className="h-[1.5px] bg-gray-300 dark:bg-gray-700 w-full"></span>
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <GoogleSignInButton />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
