import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleResetPassword = async () => {
    try {
      const res = await fetch(`${apiUrl}/resetpassword/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();

      if (data.success) {
        navigate("/");
      } else {
        window.alert("Invalid Email");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-lightpurple-login w-screen h-screen p-4 md:p-10">
      <div className="flex items-center justify-center w-full md:w-1/2 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md form-container">
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-darkpurple mt-10">
              Forgot password?
            </p>
            <p className="text-gray-700 mt-4 mb-6">
              Please enter the email address you would like your password reset
              link sent to
            </p>
          </div>

          <form className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-bold">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className="w-full border-b border-gray-400 focus:outline-none py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="w-full py-2 bg-darkpurple text-white rounded-lg font-bold hover:bg-purple-400"
              type="button"
              onClick={handleResetPassword}
            >
              Request reset link
            </button>
            <p className="text-center mt-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
