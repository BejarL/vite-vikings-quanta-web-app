import { useState } from "react";
import { Link } from "react-router-dom";
import { setJwt } from "../Auth/jwt";
import { useNavigate } from "react-router-dom";
import "../index.css";

const LoginPage = () => {
  // Toggle between login and sign-up forms
  const [isLogin, setIsLogin] = useState(true);

  // state for the input fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setUsername("");
    setPassword("");
    setConfirm("");
    setEmail("");
  };

  const handleSignUp = async () => {
    //Check to make sure the data isnt empty
    if (username === "") {
      window.alert("Missing username");
      return;
    } else if (email === "") {
      window.alert("missing email");
      return;
    } else if (password === "") {
      window.alert("Missing password");
      return;
    }

    //check the passwords
    if (password !== confirm) {
      window.alert("passwords do not match");
      return;
    }

    //try and hit the endpoint on the server for signing up to create a user
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      const data = await res.json();

      //if successfull and the jwt token exist, save the jwt token
      if (data.success && data.jwt) {
        setJwt(data.jwt);
        navigate("/quanta");
      } else {
        window.alert(`error creating user: ${data.err}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleSignIn = async () => {
    if (!username) {
      window.alert("Missing username/email");
      return;
    } else if (!password) {
      window.alert("Missing password");
      return;
    }

    //try and hit the endpoint the endpoint to sign in
    try {
      const res = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      //if successfull and a jwt token, save the token and navigate to the dashboard
      if (data.success && data.jwt) {
        setJwt(data.jwt);
        navigate("/Quanta");
      } else {
        window.alert(`error signing in: ${data.err}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="bg-lightpurple-login w-[100vw] h-[100vh] md:p-[50px]">
      <div className="flex flex-col items-center md:flex-row md:h-[100%] md:justify-between">
        {/* img */}
        <div className="h-[100%] flex flex-col items-center w-[65%] md:w-[100%]">
          <p className="text-shadow z-[1] text-5xl font-bold p-3 flex justify-center text-slate-100 mt-[30px] md:mt-[100px]">
            QUANTA
          </p>
          <p className="text-shadow z-[1] px-2 text-2xl text-center text-slate-100 md:mb-[100px]">
            Time Tracker App for desktop and mobile
          </p>
          <img
            src="/images/Quanta-Login.png"
            alt="Login image"
            className="main-img w-[85%] md:w-[80%]"
          />
        </div>

        {/* Login Page */}
        <div className="z-[1] h-[100%] flex items-center justify-center md:w-[100%]">
          <div className="relative bg-white p-9 rounded-lg shadow-md w-[400px] min-w-lg min-w-[350px] pt-1 h-[100%] md:flex md:flex-col md:items-center md:h-[90%] md:w-[70%]">
            {/* Toggle Button */}
            <div className="self-center mt-5 bg-lightpurple-login rounded-3xl flex justify-evenly mb-4 md:flex md:w-[80%] md:mb-[100px]">
              <button
                className={`py-2 px-4 my-1  rounded-3xl font-bold mb:min-w-[110px] ${
                  isLogin ? "text-white bg-darkpurple " : "text-gray-700"
                }`}
                onClick={toggleForm}
              >
                <p className="mb:w-[110px]">Sign In</p>
              </button>
              <button
                className={`py-2 px-4 my-1 rounded-3xl font-bold ${
                  !isLogin ? "text-white bg-darkpurple" : "text-gray-700"
                }`}
                onClick={toggleForm}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form action="" className="w-full md:w-[90%]">
                <div className="mb-4 md:w-[100%] ">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 text-sm font-bold mb-2 "
                  >
                    Sign in with Username or Email
                  </label>
                  <input
                    type="text"
                    placeholder="Username/Email"
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1 md:mb-[20px]"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    id="password"
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1 md:mb-[20px]"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    className="text-gray-700 w-full hover:bg-lightpurple bg-lightpurple-login rounded-3xl font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            ) : (
              // Sign up form
              <form
                action=""
                className="w-full md:w-[90%] md:flex md:flex-col"
                onSubmit={handleSignUp}
              >
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Username"
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1 md:mb-[20px]"
                    id="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="Email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    placeholder="Email"
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1 md:mb-[20px]"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1 md:mb-[20px]"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-6 relative">
                  <label
                    htmlFor="confirm"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    placeholder="Confirm Password"
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1 md:mb-[20px]"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  {password !== confirm ? (
                    <p className="text-red-700 text-center w-[100%] absolute md:bottom-[-10px]">
                      Password does not match!
                    </p>
                  ) : null}
                </div>
                <div className="md:flex md:justify-center">
                  <button
                    className="text-gray-700 w-full hover:bg-lightpurple bg-lightpurple-login rounded-3xl font-bold py-2 px-4 focus:outline-none focus:shadow-outline md:w-[90%] md:mb-[20px]"
                    type="button"
                    onClick={handleSignUp}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}
            <div>
              {isLogin ? (
                <p className="absolute bottom-[0px] left-0 w-[100%] text-center md:bottom-[300px]">
                  <Link to="/forgot-password" className="text-sky-600">
                    Forgot your password?
                  </Link>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
