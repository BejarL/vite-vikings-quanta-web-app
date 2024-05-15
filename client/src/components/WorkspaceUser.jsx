
import { useState, useRef, useEffect, useContext } from "react";
import { getJwt } from "../Auth/jwt";
import RemoveUser from "../modals/RemoveUser";

import { userContext } from "../pages/Layout";
 
const WorkspaceUser = ({ user, getUsers }) => {
  const [role, setRole] = useState(user.workspace_role);
  const [isOpen, setIsOpen] = useState(false);
  const { workspace } = useContext(userContext); 
  const initial = useRef(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  //debouncing for role change
  useEffect(() => {
    if (initial.current) {
      initial.current = false
    } else {
      const id = setTimeout(() => {
        changeRole();
      }, 500);
      return () => clearTimeout(id);
    }
  }, [role]);

  const changeRole = async () => {
    try {
      const jwt = getJwt();
        const response = await fetch(`${apiUrl}/workspace/update-role`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: jwt,
          },
          body: JSON.stringify({
            user_id: user.user_id,
            username: user.username,
            workspace_id: workspace.workspace_id,
            role
          })
        });
        
        const {success, err } = await response.json();
        if (!success) {
          window.alert(err);
        }
    } catch (error) {
        console.log(error);
    }
  }

  const toggleModal = () => {
    setIsOpen(prev => !prev);
  }

  return (
    <>
      <tr className="w-[100%] bg-white">
        <td className="border-t border-gray-300 border-dashed p-2 max-w-[100px] overflow-x-auto">{user.email} </td>
        <td className="border-t border-gray-300 border-dashed p-2">{user.username}</td>
        <td className="border-t border-gray-300 border-dashed p-2">
          {
            role === "Creator" ? <p>Creator</p> :
            role === "Admin" && workspace.workspace_role === "Admin" ? <p>Admin</p> :
            <select 
              value={role}
              onChange={(e)=> setRole(e.target.value)}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          }
        </td>
        <td className="border-t border-gray-300 border-dashed p-2">
          {/* Delete button */}
          <RemoveUser isOpen={isOpen} 
                      toggleModal={toggleModal} 
                      user={user} 
                      workspace={workspace} 
                      getUsers={getUsers}
          />
          {/* need to render differently based on the signed in users role */}
          { role === "Creator" ? <p className="text-gray-500 p-2">Remove</p> : 
            role === "Admin" && workspace.workspace_role === "Admin" ? <p className="text-gray-500 p-2">Remove</p> :
            <>
            <button 
              className="bg-gray text-black p-2 py-2 rounded-md mr-1 md:order-3"
              onClick={toggleModal}
            >
              Remove
            </button>
          </>
        }
        </td>
      </tr>
    </>
  )
};

export default WorkspaceUser;