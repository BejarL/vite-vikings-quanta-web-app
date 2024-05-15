import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InviteToWorkspace from "../modals/InviteToWorkspace";
import { userContext } from "./Layout";
import { getJwt } from "../Auth/jwt";
import WorkspaceUser from "../components/WorkspaceUser";

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { workspace } = useContext(userContext);

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
    }
  }, []);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const verifyAccess = () => {
    if (workspace.workspace_role === "Member") {
      navigate("/Quanta");
    }
  };

  const getUsers = async () => {
    verifyAccess();
    try {
      const jwt = getJwt();
      if (!jwt) {
        setError("Authentication error. Please login again.");
        navigate("/login");
        return;
      }
      const res = await fetch(
        `${apiUrl}/workspace/users/${workspace.workspace_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: jwt,
          },
        }
      );
      const { success, data, err } = await res.json();
      if (success) {
        setUsers(data);
      } else {
        throw new Error(err || "Failed to fetch users.");
      }
    } catch (error) {
      setError("Error loading users: " + error.message);
    }
  };

  const debouncedSetSearchQuery = useCallback((value) => {
    setSearchQuery(value.toLowerCase());
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => user.email.toLowerCase().includes(searchQuery)),
    [users, searchQuery]
  );

  const paginatedUsers = useMemo(
    () => filteredUsers.slice((page - 1) * pageSize, page * pageSize),
    [filteredUsers, page, pageSize]
  );

  const userElems = paginatedUsers.map((user) => (
    <WorkspaceUser user={user} key={user.user_id} getUsers={getUsers} />
  ));

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 mt-4">
      <div className="flex justify-between items-center mb-5">
        <InviteToWorkspace
          isOpen={isOpen}
          toggleModal={toggleModal}
          workspace_id={workspace.workspace_id}
          getUsers={getUsers}
        />
        <h1 className="text-2xl font-bold">WorkSpace Users</h1>
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={toggleModal}
          aria-label="Invite new user"
        >
          INVITE
        </button>
      </div>

      <div className="flex mb-5">
        <input
          type="text"
          placeholder="Search by email"
          className="shadow border text-gray-700 w-[20%] appearance-none leading-tight py-2 px-4 rounded mr-2 mt-2 flex-grow md:flex-grow-0 focus:outline-none focus:shadow-outline"
          onChange={(e) => debouncedSetSearchQuery(e.target.value)}
        />
        <div className="min-w-[200px] shadow flex no-wrap mt-2">
          <button
            className={`py-2 px-4 md:px-6 border-r rounded-l ${
              filter === "all" ? "bg-purple-500 text-white" : "bg-white"
            }`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            className={`py-2 px-4 md:px-6 border-r ${
              filter === "active" ? "bg-purple-500 text-white" : "bg-white"
            }`}
            onClick={() => handleFilterChange("active")}
          >
            Active
          </button>
          <button
            className={`py-2 px-4 md:px-6 rounded-r ${
              filter === "pending" ? "bg-purple-500 text-white" : "bg-white"
            }`}
            onClick={() => handleFilterChange("pending")}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-md overflow-x-auto">
        <table className="w-full table-auto bg-white">
          <thead>
            <tr className="bg-lightpurple-login">
              <th className="border-r p-2 text-left min-w-[50px] overflow-hidden">
                Email
              </th>
              <th className="border-r p-2 text-left max-w-[100px]">Username</th>
              <th className="border-r p-2 text-left">Role</th>
              <th className="p-2 text-left w-[10px] min-w-[50px]">Actions</th>
            </tr>
          </thead>
          <tbody>{userElems}</tbody>
        </table>
      </div>

      {/* Pagination only if more than 10 users. */}
      {filteredUsers.length > pageSize && (
        <div className="p-2">
          <button
            className="hover:text-purple-500 hover:cursor-pointer text-black font-bold py-2 px-2"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="hover:text-purple-500 hover:cursor-pointer text-black font-bold py-2 px-2"
            onClick={() => setPage(page + 1)}
            disabled={page * pageSize >= users.length}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
