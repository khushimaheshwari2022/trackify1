// import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showErrorModal, setShowErrorModal] = useState(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const authCheck = () => {
    setTimeout(() => {
      fetch("http://localhost:4000/api/login")
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data));
          authContext.signin(data._id, () => {
            navigate("/");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 3000);
  };

  const loginUser = (e) => {
    if (form.email === "" || form.password === "") {
      alert("To login user, enter details to proceed...");
    } else {
      fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Invalid credentials");
          }
          return response.json();
        })
        .then(() => {
          authCheck();
        })
        .catch((error) => {
          console.log("Login failed ", error);
          setShowErrorModal(true);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {showErrorModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-icon-error">!</div>
            </div>
            <div className="modal-body">
              <div className="modal-title">Invalid credentials</div>
              <div className="modal-sub">Please check your email and password and try again.</div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn-primary" onClick={() => setShowErrorModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="h-screen grid lg:grid-cols-2 bg-[#f3f2e9]">
        {/* Left brand/visual panel */}
        <div className="login-illustration-wrap relative hidden lg:block h-screen">
          <img
            src={require("../assets/signup.png")}
            alt="Store visual"
            className="login-illustration-img"
          />
          <div className="absolute inset-0 bg-[#264b73]/60" />

          {/* Animated blobs / illustration accents */}
          {/* Removed orange blob for a cleaner look */}
          <div className="login-illustration-blob bg-[#264b73] animate-float-slow" style={{ bottom: "6rem", right: "3rem" }} />
        </div>

        {/* Right form panel */}
        <div className="h-screen flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <img
                className="mx-auto lg:mx-0 h-16 w-auto"
                src={require("../assets/logo.png")}
                alt="Your Company"
              />
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <span className="font-medium text-[#f58e49] hover:opacity-90">
                  <Link to="/register">Register now</Link>
                </span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#264b73] sm:text-sm"
                    placeholder="username@example.com"
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#264b73] sm:text-sm"
                    placeholder="••••••••"
                    value={form.password}
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
                    className="h-4 w-4 rounded border-gray-300 text-[#264b73] focus:ring-[#264b73]"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md bg-[#264b73] py-2 px-3 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#264b73]"
                  onClick={loginUser}
                >
                  Sign in
                </button>
                
                <div className="relative">
                  
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#f3f2e9] text-gray-500">Or</span>
                  </div>
                </div>
                
                <Link
                  to="/register"
                  className="group relative flex w-full justify-center rounded-md bg-[#264b73] py-2 px-3 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#264b73] "
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
