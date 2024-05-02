import { useState } from "react";
import { getJwt } from "../Auth/jwt";

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");

  const DeleteAccount = async () => {
    const jwt = getJwt();
    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      const { success, err } = await response.json();

      if (success) {
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
    DeleteAccount();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4">
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Delete Account
          </h3>
          <form onSubmit={handleSubmit} className="mt-3 space-y-2">
            <div className="flex justify-center space-x-4">
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
            {error && <div className="text-red-500 text-sm">{error}</div>}{" "}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;

