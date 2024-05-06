import { useState } from "react";

const UsersPage = () => {
  console.log("UsersPage rendered");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const users = [
    {
      id: 1,
      email: "user1@example.com",
      username: "User1",
      role: "Admin",
      status: "Active",
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  return (
    <div className="Container mx-auto p-4">
      <h1 className="text-2x1 font-bold mb-4">WorkSpace Users</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        INVITE
      </button>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by email"
          className="border border-gray-300 p-2 rounded-1 mr-2 flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className={`p-2 rounded-r ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
