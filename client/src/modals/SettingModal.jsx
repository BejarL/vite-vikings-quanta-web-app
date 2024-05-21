import { useState, useContext } from "react";
import { getJwt } from "../Auth/jwt";

const SettingModal = ({ isOpen, onClose, workspace, getUserData }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(true);
  const [userConfirm , setUserConfirm] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [confirmLeave, setConfirmLeave] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const renameWorkspace = async () => {

    if (workspaceName === "") {
      setError("Please enter a workspace name");
      return;
    }

    const jwt = getJwt();

    try {
      const response = await fetch(`${apiUrl}/workspace/update-name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
        body: JSON.stringify({ 
          workspace_name: workspaceName, 
          workspace_id: workspace.workspace_id 
        }),
      });

      const { success, err } = await response.json();

      if (success) {
        getUserData();
        onClose();
      } else {
        setError(err)
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkspace = async () => {
    const jwt = getJwt();

    try {
      const response = await fetch(`${apiUrl}/workspace/delete/${workspace.workspace_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        }
      });

      const { success, err } = await response.json();

      if (success) {
        getUserData();
        onClose();
      } else {
        setError(err)
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveWorkspace = async () => {
    const jwt = getJwt();

    try {
      const response = await fetch(`${apiUrl}/workspace/leave`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        }, 
        body: JSON.stringify({
          workspace_id: workspace.workspace_id
        })
      });

      const { success, err } = await response.json();

      if (success) {
        getUserData();
        onClose();
      } else {
        setError(err)
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleConfirmButton = () => {
    setShowConfirm((prev) => !prev);
  };

  const toggleUserButton = () => {
    setUserConfirm((prev) => !prev);
  };

  const handleDelete = (e) => {
    const confirmCheck = /confirm/i
    if (e.key === "Enter") {
      if (confirmCheck.test(confirmDelete)) {
        deleteWorkspace()
        setUserConfirm(true);
        setShowConfirm(true);
      } else {
        setError("Double check you've typed 'Confirm'");
      }
    } 
  }

  const handleLeave = (e) => {
    const confirmCheck = /confirm/i
    if (e.key === "Enter") {
      if (confirmCheck.test(confirmDelete)) {
        leaveWorkspace();
      } else {
        setError("Double check you've typed 'Confirm'");
      }
    } 
  }

  const handleCloseModal = () => {
    onClose();
    setIsLoading(false);
    setUserConfirm(true);
    setShowConfirm(true);
    setError("");
    setConfirmDelete("");
    setConfirmLeave("")
  }

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 ">
        <button className="flex ml-auto" onClick={handleCloseModal}>
          <svg className="hover:text-red-500" xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 2048 2048"><path fill="currentColor" d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"/></svg>
        </button>
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5">
             Workspace Setting
          </h3>
          {/* if role is creator or personal */}
          {workspace.workspace_role == "Creator" || workspace.workspace_role == "Personal" ?  
            <>
              <div className="flex ">
                <input
                  type="text"
                  name="workspace-name"
                  className="appearance-none rounded-none relative block w-1/2 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Rename Workspace..."
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  required
                />
                <button className="block w-1/4 border border-transparent ml-auto rounded bg-green-100 hover:bg-green-200 text-green-700 text-sm"
                  onClick={renameWorkspace}
                >Rename</button>
              </div>
              <p className="text-red-500 py-3">{error}</p>
              <div className="flex justify-center  pt-3">
                {workspace.workspace_role == "Personal" ? null : showConfirm ?
                // for toggling delete button
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 max-w-[70px] md:min-w-[110px] ml-auto text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    disabled={isLoading}
                    onClick = {toggleConfirmButton}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </button>
                  : /* if not showConfirm */
                  <>
                    <p className="text-sm font-m w-1/2 md:max-w-[200px]">Type "Confirm" to delete your Workspace and then press the "Enter" key.</p>
                    {/* input for deleting a workspace */}
                    <input
                      type="text"
                      placeholder="Confirm"
                      className="justify-center text-center rounded-md border border-transparent px-4 py-2 w-1/4 md:w-[110px] ml-auto text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 max-h-[37px]"
                      onKeyDown={handleDelete}
                      onChange={(e) => setConfirmDelete(e.target.value)}
                    /> 
                  </>
                }
              </div>
            </>
            // if role is member
            : workspace.workspace_role == "Member" || workspace.workspace_role == "Admin" ?  userConfirm ? 
            // for toggling leave button  
              <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 min-w-[110px] ml-auto text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    disabled={isLoading}
                    onClick = {toggleUserButton}
                  >
                    {isLoading ? "Leaving..." : "Leave Workspace"}
                  </button>
            : 
            // confirm leave workspace after pressing leave
            <div className="flex">
            <p className="text-sm font-m max-w-[200px]">Type "Confirm" to leave your Workspace and then press the "Enter" key.</p>
            <input
              type="text"
              placeholder="Confirm"
              className="justify-center text-center rounded-md border border-transparent px-4 py-2 max-w-[110px] ml-auto text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 max-h-[37px]"
              onKeyDown={handleLeave}
              onChange={(e) => setConfirmDelete(e.target.value)}
            /> 
          </div>
            : null}
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
