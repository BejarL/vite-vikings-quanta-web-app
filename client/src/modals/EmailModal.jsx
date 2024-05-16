import { useState } from "react";
import { getJwt } from "../Auth/jwt";

const EmailModal = ({ isOpen, onClose, setEmail }) => {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const updateEmail = async () => {
    const jwt = getJwt();

    const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailCheck.test(newEmail)) {
      setError("Invalid Email");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user/change-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        throw new Error("Failed to update email");
      }

      const { success, err } = await response.json();

      if (success) {
        setEmail(newEmail);
        alert("Email updated successfully");
        onClose();
        setNewEmail("");
        setError("");
      } else {
        throw new Error(err || "Unknown error occurred");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateEmail();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4">
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Change Email
          </h3>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-2">
            <input
              type="email"
              name="new-email"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="New email..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <div className="flex justify-center space-x-4 pt-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={() => {
                  setError("");
                  onClose();
                }}
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

export default EmailModal;
