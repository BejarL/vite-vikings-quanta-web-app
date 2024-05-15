import { useState, useContext } from "react";
import { getJwt, verifyData } from "../Auth/jwt";

const SettingModal = ({ isOpen, onClose, workspace }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(true);
  const [userConfirm , setUserConfirm] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [confirmLeave, setConfirmLeave] = useState("");


  const apiUrl = import.meta.env.VITE_API_URL;

  const createWorkspace = async () => {
    const jwt = getJwt();

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/workspace/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
        body: JSON.stringify({ workspace_name: workspaceName }),
      });

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

  const toggleConfirmButton = () => {
    setShowConfirm((prev) => !prev);
  };

  const toggleUserButton = () => {
    setUserConfirm((prev) => !prev);
  };

  const resetConfirm = () => {
    setShowConfirm(true);
  };

  const resetUserConfirm = () => {
    setUserConfirm(true);
  };

  const confirmCheckState = () => {
    const confirmCheck = new RegExp(confirm);
    if (!confirmCheck.test(confirmDelete.toLowerCase())) {
    return 
    }
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 ">
        <button className="flex ml-auto" onClick={() => {
                    onClose();
                    resetConfirm();
                    resetUserConfirm();
                  }}>
          <svg className="hover:text-red-500" xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 2048 2048"><path fill="currentColor" d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"/></svg>
        </button>
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5">
             Workspace Setting
          </h3>
          {workspace.workspace_role == "Creator" ?  
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
                <button className="block w-1/4 border border-transparent ml-auto rounded bg-green-100 hover:bg-green-200 text-green-700 text-sm">Rename</button>
              </div>
              <div className="flex justify-center  pt-3">
                {showConfirm ?
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 max-w-[70px] md:min-w-[110px] ml-auto text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    disabled={isLoading}
                    onClick = {toggleConfirmButton}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </button>
                  : 
                  <>
                    <p className="text-sm font-m w-1/2 md:max-w-[200px]">Type "Confirm" to delete your Workspace and then press the "Enter" key.</p>
                    <input
                      type="text"
                      placeholder="Confirm"
                      className="justify-center text-center rounded-md border border-transparent px-4 py-2 w-1/4 md:w-[110px] ml-auto text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 max-h-[37px]"
                      onSubmit={confirmCheckState}
                    /> 
                  </>
                }
              </div>
            </>
            : userConfirm ? 
              <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 min-w-[110px] ml-auto text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    disabled={isLoading}
                    onClick = {toggleUserButton}
                  >
                    {isLoading ? "Leaving..." : "Leave Workspace"}
                  </button>
            : 
            <div className="flex">
            <p className="text-sm font-m max-w-[200px]">Type "Confirm" to leave your Workspace and then press the "Enter" key.</p>
            <input
              type="text"
              placeholder="Confirm"
              className="justify-center text-center rounded-md border border-transparent px-4 py-2 max-w-[110px] ml-auto text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 max-h-[37px]"
              onSubmit={confirmCheckState}
            /> 
          </div>
            }
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
