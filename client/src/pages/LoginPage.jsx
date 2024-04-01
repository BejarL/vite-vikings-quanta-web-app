import { useState } from "react";

const LoginPage = () => {
  // Toggle between login and sign-up forms
  const [isLogin, setIsLogin] = useState(true);
 
  

  return (
    <div className="bg-lightpurple-login">
      <div className="login min-h-screen flex">
        <div className="w-1/2 flex justify-center items-center relative">
        <div className="absolute top-12 text-gray-800" >
        <p className="text-5xl font-bold mb-3">QUANTA</p>
        <p className="text-4xl">Time Tracker App for desktop and mobile</p>
        </div>
          <img
            src="/images/Quanta-Login.png"
            alt="Login image"
            className="max-w-s "
          />
        </div>

        {/* Login Page */}
        <div className="w-1/2 flex justify-center items-center">
          <div className="bg-white p-9 rounded-lg shadow-md w-full max-w-sm">
            {/* Toggle Button */}
            <div className="self-center mt-4 bg-lightpurple-login rounded-3xl flex justify-center mb-4">
              <button
                className={`py-2 px-4 my-1 mx-5 rounded-3xl font-bold ${
                  isLogin ? "text-white bg-darkpurple " : "text-gray-700"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button
                className={`py-2 px-4 my-1 mx-5 rounded-3xl font-bold ${
                  !isLogin ? "text-white bg-darkpurple" : "text-gray-700"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form action="" className="w-full max-w-xs">
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
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1"
                    id="username"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    placeholder="Password"
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1"
                  />
                </div>
                <div>
                  <button
                    className="text-gray-700 w-full hover:bg-lightpurple bg-lightpurple-login rounded-3xl font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form action="" className="w-full max-w-xs">
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
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1"
                    id="username"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    placeholder="Email"
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1"
                    id="username"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    placeholder="Password"
                    className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1"
                  />
                </div>
                <div>
                  <button
                    className="text-gray-700 w-full hover:bg-lightpurple bg-lightpurple-login rounded-3xl font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
