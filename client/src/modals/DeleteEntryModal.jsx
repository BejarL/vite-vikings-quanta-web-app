import { useState, useContext } from "react";
import { getJwt } from "../Auth/jwt";
import { userContext } from "../pages/Layout";

const DeleteEntryModal = ({
  isOpen,
  onClose,
  projectId,
  getEntries,
  entry,
}) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { workspace } = useContext(userContext);

  const apiUrl = import.meta.env.VITE_API_URL;

  const deleteEntry = async () => {
    const jwt = getJwt();
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/entries/delete/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
        body: JSON.stringify({
          project_id: projectId,
          workspace_id: workspace.workspace_id,
          entry_id: entry.entry_id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.err || "Failed to delete project");
      }

      if (data.success) {
        getEntries();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await deleteEntry();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-[5]">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4">
        <div className="text-center p-5">
          <h3 className="text-2xl leading-6 font-medium text-gray-900">
            Delete Entry
          </h3>
          <p className="text-lg pt-3 leading-6 font-medium text-gray-900">
            Are you sure you want to permanently delete this entry?
          </p>
          <form onSubmit={handleSubmit} className="mt-3 space-y-2">
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
                disabled={isLoading}
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
              >
                {isLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteEntryModal;
