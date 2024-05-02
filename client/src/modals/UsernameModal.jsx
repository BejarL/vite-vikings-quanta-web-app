import { useState, useEffect } from "react";
import { getJwt } from "../Auth/jwt";

const UsernameModal = ({ isOpen, onClose, setName }) => {
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState(""); // Added error state

  const createNewUsername = async () => {
    const jwt = getJwt();
    try {
      const response = await fetch("http://localhost:3000/user/change-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
        body: JSON.stringify({ username: newUsername }),
      });
      if (!response.ok) {
        throw new Error("Failed to update username");
      }
      
      const { success, err } = await response.json(); 

      if (success) {
        setName(newUsername);
        setNewUsername("");
        setError("");
        onClose();
      } else {
        setError(err);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createNewUsername();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4">
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Change Username
          </h3>
          <form onSubmit={handleSubmit} className="mt-8 space-y-2">
            <input
              type="text"
              name="new-username"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="New username..."
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}{" "}
            <div className="flex justify-end space-x-4">
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

export default UsernameModal;
