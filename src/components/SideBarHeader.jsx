import { FiSettings } from "react-icons/fi";

const SidebarHeader = ({
  user,
  showMenu,
  setShowMenu,
  setShowProfile,
  setShowLogoutConfirm,
}) => {
  return (
    <div className="p-4 border-b border-gray-700 flex items-center justify-between relative">
      {/* LEFT: USER INFO */}
      <div className="flex items-center gap-3">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="font-semibold">{user?.name}</h2>
          <p className="text-sm text-gray-400 truncate">
            {user?.bio || "Hey there! I am using WhatsApp."}
          </p>
        </div>
      </div>

      {/* RIGHT: SETTINGS */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-2xl text-gray-300 hover:text-white"
        >
          <FiSettings />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-[#2A3942] rounded-lg shadow-xl z-50">
            <button
              onClick={() => {
                setShowMenu(false);
                setShowProfile(true);
              }}
              className="w-full text-left px-4 py-2 hover:bg-[#3B4A54]"
            >
              Update Profile
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                setShowLogoutConfirm(true);
              }}
              className="w-full text-left px-4 py-2 hover:bg-[#3B4A54]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default SidebarHeader;
