import { useState } from "react";
import { getJwt } from "../Auth/jwt";

const RemoveUser = ({ isOpen, toggleModal, user, workspace, getUsers }) => {
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const removeUser = async () => {
    console.log("here");
    try {
        const jwt = getJwt();
          const response = await fetch(`${apiUrl}/workspace/leave`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: jwt,
            },
            body: JSON.stringify({
              user_id: user.user_id,
              workspace_id: workspace.workspace_id
            })
          });
          
          const {success, err } = await response.json();
          if (!success) {
            setError(err)
          } else {
            getUsers();
          }
      } catch (error) {
          console.log(error);
      }
  }
 
  const handleSubmit = (event) => {
    event.preventDefault();
    removeUser();
  };


  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4">
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Are you sure you want to remove {user.username}?
          </h3>
          <form className="mt-8 space-y-2"
            onSubmit={handleSubmit}
          >
            {error && <div className="text-red-500 text-sm">{error}</div>}{" "}
            <div className="flex justify-center space-x-4 pt-3">
              <button
                type="button"
                onClick={toggleModal}
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
              >
                Remove
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RemoveUser;
