import { useState } from "react";
import { getJwt } from "../Auth/jwt";

const PasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const createNewPassword = async () => {
    const jwt = getJwt();

    try {
      const response = await fetch(
        `${apiUrl}/user/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: jwt,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      // Check if the request was not successful
      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      const { success, err } = await response.json();

      if (success) {
        // If the password was updated successfully, clear states and close modal
        setError("");
        alert("Password updated successfully");
        setNewPassword("");
        setOldPassword("");
        onClose();
      } else {
        // Set the error state to the error returned from the server or a default message
        setError(err || "Unknown error occurred");
      }
    } catch (err) {
      // If there's an exception during the fetch operation, set the error state to the error message
      setError(err.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createNewPassword();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4">
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Change Password
          </h3>

          {error && <div className="text-red-500">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-2">
            <input
              type="password"
              name="old-password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Old password..."
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <input
              type="password"
              name="new-password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="New password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <div className="flex justify-center space-x-4 pt-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
