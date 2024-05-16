import { useContext, useState } from "react";
import { userContext } from "./Layout";
import LetteredAvatar from "../components/LetteredAvatar";
import UsernameModal from "../modals/UsernameModal";
import PasswordModal from "../modals/PasswordModal";
import EmailModal from "../modals/EmailModal";
import DeleteAccountModal from "../modals/DeleteAccountModal";

const UserProfile = () => {
  const { user } = useContext(userContext) || {};
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="flex flex-col items-center p-6 w-full max-w-lg rounded-lg shadow-lg bg-white">
        <LetteredAvatar name={username} size="large" />
        <h2 className="mt-4 text-2xl font-bold text-gray-700">{username}</h2>

        <div className="w-full px-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700 font-bold">{username}</p>
            <UserInfo onEdit={() => setUsernameModalOpen(true)} />
            <UsernameModal
              isOpen={isUsernameModalOpen}
              onClose={() => setUsernameModalOpen(false)}
              setName={setUsername}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700 font-bold">{email}</p>
            <UserInfo onEdit={() => setEmailModalOpen(true)} />
            <EmailModal
              isOpen={isEmailModalOpen}
              onClose={() => setEmailModalOpen(false)}
              setEmail={setEmail}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700">**********</p>
            <UserInfo onEdit={() => setPasswordModalOpen(true)} />
            <PasswordModal
              isOpen={isPasswordModalOpen}
              onClose={() => setPasswordModalOpen(false)}
            />
          </div>
        </div>

        {/* Handle account deletion */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Delete Account
          </button>
        </div>
        <div className="mt-5">
          <DeleteAccountModal
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
          />
        </div>
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
