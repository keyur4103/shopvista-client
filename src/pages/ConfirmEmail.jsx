import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { confirmEmailApi, resendOtpApi } from "../services/Auth/authAPI";
import Spinner from "../utils/Spinner";

const ConfirmEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    // console.log("🚀 ~ useEffect ~ searchParams:", searchParams)
    const email = searchParams.get("email");
    setEmail(email);
  }, [location.search]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => confirmEmailApi(data, email),
    onSuccess: () => {
      toast.success("Email Verified Successfully");
      reset();
      navigate("/login");
    },
  });

  const onSubmit = async (data) => {
    // console.log("Form submitted with data:", data);
    mutate(data);
  };

  // Resend OTP Mutation
  const { mutate: resendMutate } = useMutation({
    mutationFn: () => resendOtpApi(email),
    onSuccess: () => {
      toast.success("OTP Sent Successfully");
    },
  });

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
            ShopVista
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Confirm Email
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    {...register("otp", { required: "OTP is required" })}
                    className={`bg-gray-50 border ${
                      errors.otp ? "border-red-500" : "border-gray-300"
                    } text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="••••••••"
                    required=""
                  />
                  {/* Display error message if there is an error */}
                  {errors.otp && (
                    <p className="text-red-500 text-sm">{errors.otp.message}</p>
                  )}
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t get OTP ?{" "}
                  <span
                    onClick={() => {
                      resendMutate();
                    }}
                    className="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Resend OTP
                  </span>
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <Spinner width={6} height={6} />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfirmEmail;
