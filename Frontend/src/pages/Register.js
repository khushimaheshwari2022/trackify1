import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UploadImage from "../components/UploadImage";
import API_URL from "../config/api";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    imageUrl: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  // Handling Input change for registration form.
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Register User
  const registerUser = (e) => {
    e.preventDefault(); // stop form reload

    fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to register");
        }
        return res.json();
      })
      .then((data) => {
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Registration error:", err);
        alert("Error: " + err.message);
      });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center bg-[#285181]">
        <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={require("../assets/darklogo.png")}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#f1f2ea]">
              Register your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={registerUser}>
            <div className="flex flex-col gap-4 -space-y-px rounded-md shadow-sm">
              <div className="flex gap-4">
                <input
                  name="firstName"
                  type="text"
                  required
                  className="relative block w-full rounded-xl border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleInputChange}
                />
                <input
                  name="lastName"
                  type="text"
                  required
                  className="relative block w-full rounded-xl border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-xl border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-xl border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  name="phoneNumber"
                  type="number"
                  autoComplete="phoneNumber"
                  required
                  className="relative block w-full rounded-xl border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  required
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[#f1f2ea]"

                >
                  I Agree Terms & Conditions
                </label>
              </div>

            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-[#e98a4f] py-2 px-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e98a4f]"
              >
                Sign up
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <span className="font-medium text-[#e98a4f] hover:opacity-90">
                  {" "}
                  <Link to="/login">Already Have an Account? Sign in now </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
        <div className="flex justify-center order-first sm:order-last h-screen w-full relative">
          <img className="m-0 h-full w-full object-cover" src={require("../assets/register.jpg")} alt="" />
          <div className="absolute inset-0 bg-[#f1f2ea]/30" />
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 w-11/12 max-w-lg rounded-3xl bg-[#f1f2ea] p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="absolute right-3 top-3 text-[#285181] hover:opacity-80"
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e98a4f]/15 relative">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#e98a4f]/20 animate-ping" />
                <svg viewBox="0 0 24 24" className="relative z-10 h-8 w-8 text-[#e98a4f]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#285181]">Registration successful!</h3>
              <p className="mt-2 text-sm text-[#285181]">You have successfully registered as a user.</p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-6 w-full rounded-xl bg-[#e98a4f] py-2.5 px-4 text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e98a4f]"
              >
                Go to Login Page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;
