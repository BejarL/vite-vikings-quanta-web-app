import { useState, useContext, useEffect} from "react"
import InviteToWorkspace from "../modals/InviteToWorkspace"
import { userContext } from "./Layout";
import { getJwt } from "../Auth/jwt";
import WorkspaceUser from "../components/WorkspaceUser";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const { workspace } = useContext(userContext);
  
  useEffect(() => {
    getUsers();
  }, [])

  const toggleModal = () => {
    setIsOpen(prev => !prev);
  }

  //ensures the user should have access to the page. if they are a member, navigate to the time tracker page.
  const verifyAccess = () => {
    if (workspace.workspace_role === "Member") {
      navigate("/Quanta");
    }
  }

  const getUsers = async () => {
    verifyAccess();
    try {
      const jwt = getJwt();

      const res = await fetch(`${apiUrl}/workspace/users/${workspace.workspace_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            authorization: jwt,
        }
      });

      const {success, data, err} = await res.json();

      if (success) {
        setUsers(data);
      }


    } catch (err){
      window.alert("Error loading users");
    } 
  }

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const userElems = users.map(user => {
    return <WorkspaceUser user={user} key={user.user_id} getUsers={getUsers}/>
  })

  return (
    <div className="Container mx-auto p-4">
      <InviteToWorkspace 
        isOpen={isOpen}
        toggleModal={toggleModal}
        workspace_id={workspace.workspace_id}
        getUsers={getUsers}
      />
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold mb-4">WorkSpace Users</h1>
      <button className="bg-purple-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
              onClick={toggleModal}
      >
        INVITE
      </button>
      </div>
      
      
        <div className="flex mb-2 flex-wrap justify-center items-center md:justify-start">
          <input type="text" 
                placeholder="Search by email" 
                className="border border-gray-300 py-2 px-4 rounded-lg mr-2 mt-2 flex-grow md:flex-grow-0" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <div className="min-w-[200px] flex no-wrap mt-2">
            <button className={`py-2 px-4 md:px-6  border border-black  ${filter === "all" ? "bg-blue-500 text-white" : "bg-white"}`} onClick={() => handleFilterChange("all")}>
              All
            </button>
            <button className={`py-2 px-4 md:px-6  border border-black  ${filter === "active" ? "bg-blue-500 text-white" : "bg-white"}`} onClick={() => handleFilterChange("active")}>
              Active
            </button>
            <button className={`py-2 px-4 md:px-6  border border-black   ${filter === "pending" ? "bg-blue-500 text-white" : "bg-white"}`} onClick={() => handleFilterChange("pending")}>
              Pending
            </button>
          </div>
        </div>
        <div className="mt-2">
          <table className="w-full table-auto border-collapse border border-gray-300 ">
            <thead>
              <tr className="bg-gray-200 w-[100%]">
                <th className="border border-gray-300 p-2 text-left min-w-[50px] overflow-hidden">Email</th>
                <th className="border border-gray-300 p-2 text-left max-w-[100px]">Username</th>
                <th className="border border-gray-300 p-2 text-left">Role</th>
                <th className="border border-gray-300 p-2 text-left w-[10px] min-w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="w-full">
              {userElems}
            </tbody>
          </table>
        </div>
        </div>
  );
};

export default UsersPage;

