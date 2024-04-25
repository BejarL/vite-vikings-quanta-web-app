import { useState, useEffect } from "react";
import LetteredAvatar from "../components/LetteredAvatar";

const UserProfile = () => {
  const [userName, setUserName] = useState("Loading...");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await fetch("http://localhost:3000/user");
      const data = await response.json();
      setUserName(data.username);
    } catch (error) {
      console.error("Failed to fetch username:", error);
      setUserName("Failed to load username");
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    // Implement the API call to update the username here
    console.log("Username would be updated to:", newUsername);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Implement the API call to update the password here
    console.log("Password would be updated to:", password);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
      <LetteredAvatar name={userName} />
      <h2 className="mt-4 text-lg font-semibold">{userName}</h2>
      <button
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={fetchUsername}
      >
        Refresh Username
      </button>
      <form onSubmit={handleUsernameChange}>
        <input
          type="text"
          placeholder="New username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="mt-2 p-1 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Change Username
        </button>
      </form>
      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 p-1 rounded"
        />
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
