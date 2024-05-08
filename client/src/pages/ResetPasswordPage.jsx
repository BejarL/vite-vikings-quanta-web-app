import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="bg-lightpurple-login w-[100vw] h-[100vh] md:p-[50px] flex items-center justify-center">
      <div className="z-[1] h-[80%] flex items-center justify-center md:w-[90%]">
        <div className="relative bg-white p-9 rounded-lg shadow-md w-[400px]  min-w-md min-w-[350px] pt-1 h-[100%] md:flex md:flex-col md:items-center md:h-[90%] md:w-[70%]">
          <div className="self-center text-gray-700 font-bold text-4xl mt-10 flex justify-evenly md:flex md:w-[80%] ">
            <p>Forgot password?</p>
          </div>
          <div className="self-center mt-4 flex mb-4 justify-evenly md:flex md:w-[80%] md:mb-[100px]">
            <p>
              Please enter the email address you would like your password reset
              link sent to
            </p>
          </div>
          <form action="" className="w-full md:w-[90%]">
            <div className="mb-4 md:w-[100%] ">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2 "
              >
                Email
              </label>
              <input
                type="text"
                placeholder="Enter email"
                className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1 md:mb-[20px]"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                className="text-gray-700 w-full hover:bg-lightpurple bg-lightpurple-login rounded-3xl font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleResetPassword}
              >
                Request reset link
              </button>
              <Link
                to="/"
                className="absolute bottom-[440px] left-0 w-[100%] text-center md:bottom-[200px] text-sky-600"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
