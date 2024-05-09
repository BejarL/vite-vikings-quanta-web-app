import { useState } from "react";
import { getJwt, verifyData } from "../Auth/jwt";


const InviteToWorkspace = ({ isOpen, toggleModal, workspace_id, getUsers }) => {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("Member")
  const [error, setError] = useState("");
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const addUser = async () => {
    setIsLoading(true);
    try {
        const jwt = getJwt();
        const response = await fetch(`${apiUrl}/workspace/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: jwt,
          },
          body: JSON.stringify({ workspace_id, user_email: userEmail, role }),
        });
        //check if the request was successful, if not do an early return
        const { success, err } = await response.json();

        if (success) {
          //get the data from the response
          setIsLoading(false);
          setUserEmail("");
          getUsers();
          toggleModal();
          // Added a check to see if data has elements to avoid errors
        } else {
          setError(err);
          setIsLoading(false);
        }
        // setProjects(data);
      } catch (err) {
        console.log(err);
      }
  }
  
  const handleRole = (e) => {
    e.preventDefault();
    setRole(e.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    addUser();
  };

  const handleClose = () => {
    setUserEmail("");
    setIsLoading(false);
    setRole("Member");
    toggleModal();
  }

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 ">
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Add User To Workspace
          </h3>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            
            <div className="flex items-center justify-between">
                <div className="text-start w-[70%]">
                    <label htmlFor="email" className="">Email</label>
                    <input
                    type="text"
                    name="email"
                    className="appearance-none mr-[10px] rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email..."
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                    />
                </div>
                <div className="text-start">
                    <label htmlFor="role">Role</label>
                    <select
                        name="role"
                        className="border w-[100%] block border-gray-300 px-2 py-2 rounded-md w-3/4 mr-2"
                        value={role}
                        onChange={handleRole}
                    >
                        <option value={"Member"}>Member</option>
                        <option value={"Admin"}>Admin</option>
                    </select>
                </div>
              </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-center space-x-4 pt-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={handleClose}
              >
                cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteToWorkspace;
