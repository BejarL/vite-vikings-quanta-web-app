import { useContext, useState } from "react";
import { userContext } from "./Layout";
import LetteredAvatar from "../components/LetteredAvatar";
import UsernameModal from "../modals/UsernameModal";
import PasswordModal from "../modals/PasswordModal";
import EmailModal from "../modals/EmailModal";

const UserProfile = () => {
  const { user } = useContext(userContext);
  const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="flex flex-col items-center p-6 w-full max-w-lg rounded-lg shadow-lg bg-lightpurple">
        <LetteredAvatar name={user.username} size="large" />
        <h2 className="mt-4 text-lg font-semibold text-gray-700 text-shadow">
          {user.username}
        </h2>

        <div className="w-full px-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700">{user.username}</p>
            <UserInfo onEdit={() => setUsernameModalOpen(true)} />
            <UsernameModal
              isOpen={isUsernameModalOpen}
              onClose={() => setUsernameModalOpen(false)}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700">{user.email}</p>
            <UserInfo onEdit={() => setEmailModalOpen(true)} />
            <EmailModal
              isOpen={isEmailModalOpen}
              onClose={() => setEmailModalOpen(false)}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700">********</p>
            <UserInfo onEdit={() => setPasswordModalOpen(true)} />
            <PasswordModal
              isOpen={isPasswordModalOpen}
              onClose={() => setPasswordModalOpen(false)}
            />
          </div>
        </div>

        {/* Need to add the handle account deletion */}
        <button className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full">
          Delete Account
        </button>
      </div>
    </div>
  );
};

const UserInfo = ({ onEdit }) => (
  <div className="flex items-center justify-between mb-4">
    <button
      onClick={onEdit}
      className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
    >
      Edit
    </button>
  </div>
);

export default UserProfile;
