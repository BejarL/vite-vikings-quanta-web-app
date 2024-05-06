import { useState } from "react";
import { getJwt, verifyData } from "../Auth/jwt";


const CreateModal = ({ isOpen, onClose }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const createWorkspace = async () => {
    const jwt = getJwt();

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/workspaces/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: jwt,
          },
          body: JSON.stringify({ name: workspaceName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      const { success, err } = await verifyData(response);

      if (success) {
        onClose();
        verifyData();
        alert("Workspace created successfully");
      } else {
        window.alert(err);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createWorkspace();
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 ">
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Create New Workspace
          </h3>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input
              type="text"
              name="workspace-name"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Workspace name..."
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
            />
            {error && <p className="text-red-500">{error}</p>}
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
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
