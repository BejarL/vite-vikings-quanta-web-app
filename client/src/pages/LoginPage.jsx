import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setJwt } from "../Auth/jwt";
import "../index.css";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Function to toggle between login and sign-up forms
  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setUsername("");
    setPassword("");
    setConfirm("");
    setEmail("");
  };

  // Function to handle user sign-up
  const handleSignUp = async () => {
    if (username === "") {
      window.alert("Missing username");
      return;
    } else if (email === "") {
      window.alert("Missing email");
      return;
    } else if (password === "") {
      window.alert("Missing password");
      return;
    }

    const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailCheck.test(email)) {
      window.alert("Invalid Email");
      return;
    }

    if (password !== confirm) {
      window.alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      if (data.success && data.jwt) {
        setJwt(data.jwt);
        navigate("/quanta");
      } else {
        window.alert(`Error creating user: ${data.err}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Function to handle user sign-in
  const handleSignIn = async () => {
    if (!username) {
      window.alert("Missing username/email");
      return;
    } else if (!password) {
      window.alert("Missing password");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success && data.jwt) {
        setJwt(data.jwt);
        navigate("/quanta/");
      } else {
        window.alert(`Error signing in: ${data.err}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-lightpurple-login h-[100%] p-4 md:p-10">
      <div className="flex flex-col md:flex-row items-center w-full h-full md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col items-center w-full md:w-1/2 p-4">
          <p className="text-5xl font-bold text-darkpurple mt-10 md:mt-20 drop-shadow-lg">
            QUANTA
          </p>
          <p className="text-2xl text-center text-darkpurple my-6">
            Time Tracker App for desktop and mobile
          </p>
          <img
            src="/images/Quanta-Login.png"
            alt="Login image"
            className="hidden md:block w-4/5 md:w-3/5"
          />
        </div>

        <div className="flex items-center justify-center w-full md:w-1/2 p-4">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md form-container">
            <div className="flex justify-around mb-6">
              <button
                className={`py-2 px-4 rounded-lg font-bold ${
                  isLogin
                    ? "text-white bg-darkpurple hover:bg-purple-400"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
                onClick={toggleForm}
              >
                Sign In
              </button>
              <button
                className={`py-2 px-4 rounded-lg font-bold ${
                  !isLogin
                    ? "text-white bg-darkpurple hover:bg-purple-400"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
                onClick={toggleForm}
              >
                Sign Up
              </button>
            </div>

            <div className="w-full form-content">
              {isLogin ? (
                <form className="w-full space-y-6 mb-10">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-gray-700 font-bold"
                    >
                      Sign in with Username or Email
                    </label>
                    <input
                      type="text"
                      id="username"
                      placeholder="Username/Email"
                      className="w-full border-b border-gray-400 focus:outline-none py-2"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-gray-700 font-bold"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Password"
                      className="w-full border-b border-gray-400 focus:outline-none py-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    className="w-full py-2 bg-darkpurple text-white rounded-lg font-bold hover:bg-purple-400"
                    type="button"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </button>
                  <p className="text-center mt-4">
                    <Link
                      to="/forgot-password"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Forgot your password?
                    </Link>
                  </p>
                </form>
              ) : (
                <form className="w-full space-y-6 mb-10">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-gray-700 font-bold"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      placeholder="Username"
                      className="w-full border-b border-gray-400 focus:outline-none py-2"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-bold"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      className="w-full border-b border-gray-400 focus:outline-none py-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-gray-700 font-bold"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Password"
                      className="w-full border-b border-gray-400 focus:outline-none py-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm"
                      className="block text-gray-700 font-bold"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirm"
                      placeholder="Confirm Password"
                      className="w-full border-b border-gray-400 focus:outline-none py-2"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                    {password !== confirm && (
                      <p className="text-red-600 text-center">
                        Passwords do not match!
                      </p>
                    )}
                  </div>
                  <button
                    className="w-full py-2 bg-darkpurple text-white rounded-lg font-bold hover:bg-purple-400"
                    type="button"
                    onClick={handleSignUp}
                  >
                    Sign Up
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
