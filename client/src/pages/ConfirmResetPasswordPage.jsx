import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../index.css";

const ConfirmResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const { jwt } = useParams();

  const handlePasswordUpdate = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmUpdate = (e) => {
    setConfirm(e.target.value);
  };

  //api call to reset password
  const resetPassword = async () => {
    //early return in case the passwords dont match
    if (newPassword !== confirm) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/resetpassword/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      //get the success of the request
      const { success } = await res.json();

      //if the password was reset, navigate to login page
      if (success) {
        navigate("/");
      } else {
        window.alert("Error resetting password");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-lightpurple-login w-screen h-screen p-4 md:p-10">
      <div className="flex items-center justify-center w-full md:w-1/2 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md form-container">
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-darkpurple mt-10">
              Reset password
            </p>
            <p className="text-gray-700 mt-4 mb-6">
              Please enter your new password below.
            </p>
          </div>

          <form className="w-full space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-gray-700 font-bold"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                placeholder="Enter new password"
                className="w-full border-b border-gray-400 focus:outline-none py-2"
                value={newPassword}
                onChange={handlePasswordUpdate}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 font-bold"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm password"
                className="w-full border-b border-gray-400 focus:outline-none py-2"
                value={confirm}
                onChange={handleConfirmUpdate}
              />
              {newPassword !== confirm && confirm && (
                <p className="text-red-600 text-center">
                  Passwords do not match!
                </p>
              )}
            </div>
            <button
              className="w-full py-2 bg-darkpurple text-white rounded-lg font-bold hover:bg-purple-400"
              type="button"
              onClick={resetPassword}
            >
              Reset password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmResetPasswordPage;
