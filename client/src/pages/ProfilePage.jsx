import { useState, useEffect } from "react";
import LetteredAvatar from "../components/LetteredAvatar";
import PasswordModal from "../modals/PasswordModal";
import UsernameModal from "../modals/UsernameModal";

const UserProfile = () => {
  const [username, setUserName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await fetch("http://localhost:3000/user");
      const data = await response.json();
      setUserName(data.user.username);
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
    <div className="flex justify-center items-center mt-5">
      <div className="flex flex-col items-center p-4 w-[80%] h-[60%] rounded-lg shadow-md bg-lightpurple">
        {username && <LetteredAvatar name={username} />}
        <h2 className="mt-4 text-lg font-semibold">{fetchUsername}</h2>
        <form onSubmit={handleUsernameChange}>
          <button
            type="submit"
            onClick={() => setIsModalOpen(true)} 
            className="bg-green-500 hover:bg-green-700 text-white m-3 font-bold py-2 px-4 rounded-lg"
          >
            Change Username
          </button>
          <UsernameModal isOpen={isModalOpen} onClose={handleModalClose} />
        </form>
        <form onSubmit={handlePasswordChange}>
          <button
            type="submit"
            onClick={() => setIsModalOpen(true)} 
            className="bg-red-500 hover:bg-red-700 text-white m-3 font-bold py-2 px-4 rounded-lg"
          >
            Change Password
          </button>
          <PasswordModal isOpen={isModalOpen} onClose={handleModalClose} />
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
