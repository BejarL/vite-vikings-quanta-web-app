import { useContext, useState } from "react";
import { userContext } from "./Layout";
import LetteredAvatar from "../components/LetteredAvatar";
import UsernameModal from "../modals/UsernameModal";
import PasswordModal from "../modals/PasswordModal";
import EmailModal from "../modals/EmailModal";
import DeleteAccountModal from "../modals/DeleteAccountModal";


const UserProfile = () => {
  const { user } = useContext(userContext);
  const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="flex flex-col items-center p-6 w-full max-w-lg rounded-lg shadow-lg bg-lightpurple">
        <LetteredAvatar name={username} size="large" />
        <h2 className="mt-4 text-lg font-semibold text-gray-700 text-shadow">
          {username}
        </h2>

        <div className="w-full px-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700">{username}</p>
            <UserInfo onEdit={() => setUsernameModalOpen(true)} />
            <UsernameModal
              isOpen={isUsernameModalOpen}
              onClose={() => setUsernameModalOpen(false)}
              setName={setUsername}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700">{email}</p>
            <UserInfo onEdit={() => setEmailModalOpen(true)} />
            <EmailModal
              isOpen={isEmailModalOpen}
              onClose={() => setEmailModalOpen(false)}
              setEmail={setEmail}
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
        <div className="flex items-center justify-between mb-4">
          <button onClick={setDeleteModalOpen} className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
            Delete Account
          </button>
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
