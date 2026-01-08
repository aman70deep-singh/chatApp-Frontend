import { useAuth } from "../context/authContext.jsx";
import { useSocket } from "../context/socketContext.jsx";
import axiosAuth from "../api/axiosAuth.js";
import { useState, useEffect } from "react";
import ProfileModal from "./profileModal.jsx";
import LogoutConfirmModal from "./logoutConfirmModal.jsx";

const Sidebar = ({ setSelectedChat, selectedChat, onlineUsers }) => {
  const { user, logout } = useAuth();
  const socket = useSocket();
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isUserOnline = (userId) => onlineUsers?.includes(userId);


  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    window.location.href = "/login";
  };

  const formatChatTime = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);
    const now = new Date();

    const isToday = messageDate.toDateString() === now.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return messageDate.toLocaleDateString();
  };

  const searchUsers = async (value) => {
    setSearch(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosAuth.get(`/users/search?query=${value}`);
      setSearchResults(res.data.users);
    } catch (error) {
      console.log("search Failed");
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (otherUserId) => {
    try {
      const res = await axiosAuth.post("/chat/create-chat", {
        userId: otherUserId,
      });

      const chat = res.data.data;
      setChats((prevChats) => {
        const exists = prevChats.find((c) => c._id === chat._id);
        if (exists) return prevChats;
        return [chat, ...prevChats];
      });

      setSelectedChat(chat);
      setSearch("");
      setSearchResults([]);
    } catch (error) {
      console.log("Failed to access chat", error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axiosAuth.get("/chat/my-chats");
      setChats(response.data.data);
    } catch (error) {
      console.log("Error fetching chats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleMessage = (message) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chatId._id
            ? { ...chat, latestMessage: message }
            : chat
        )
      );
    };

    socket.on("message-received", handleMessage);

    return () => socket.off("message-received", handleMessage);
  }, [socket]);

  useEffect(() => {
    fetchChats();
  }, []);
  const isSearching = search.trim().length > 0;

  return (
    <div className="w-1/4 bg-[#202C33] text-white flex flex-col">
      {/* USER HEADER */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between relative">
        {/* LEFT: USER INFO */}
        <div className="flex items-center gap-3">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="User profile "
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

        {/* RIGHT: setting */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-2xl text-gray-300 hover:text-white"
          >
            ⚙️
          </button>

          {/* DROPDOWN MENU */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56  bg-[#2A3942] rounded-lg shadow-xl z-50">
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

      {/* SEARCH BAR */}
      <div className="p-3 border-b border-gray-700">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => searchUsers(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-[#2A3942] text-white outline-none placeholder-gray-400"
        />
      </div>
      {/* SEARCH RESULTS */}
      {search && (
        <div className="border-b border-gray-700">
          {loading && <p className="p-4 text-gray-400">Searching...</p>}

          {!loading && searchResults.length === 0 && (
            <p className="p-4 text-gray-400">No users found</p>
          )}

          {!loading &&
            searchResults.map((u) => (
              <div
                key={u._id}
                onClick={() => accessChat(u._id)}
                className="p-4 hover:bg-[#2A3942] cursor-pointer flex gap-3"
              >
                {/* Avatar */}
                {u.profilePic ? (
                  <img
                    src={u.profilePic}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-semibold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Text Area */}
                <div className="flex-1 min-w-0">
                  {/* Name & Time */}
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{u.name}</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {u.latestMessage?.createdAt &&
                        formatChatTime(u.latestMessage.createdAt)}
                    </span>
                  </div>

                  {/* Latest Message */}
                  <p className="text-sm text-gray-400 truncate">
                    {u.latestMessage?.content ?? u.bio ?? "Start a new chat"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* CHAT LIST */}
      {!isSearching && (
        <div className="flex-1 overflow-y-auto">
          {loading && <p className="p-4 text-gray-400">Loading...</p>}

          {!loading && chats.length === 0 && (
            <p className="p-4 text-gray-400">No chats found</p>
          )}

          {!loading &&
            chats.map((chat) => {


              const otherUser = chat.userIds?.find((u) => u._id !== user?._id);

              return (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 cursor-pointer border-b border-gray-700 flex gap-3
                    ${selectedChat?._id === chat._id
                      ? "bg-[#2A3942]"
                      : "hover:bg-[#2A3942]"
                    }
                  `}
                >
                  {/* AVATAR WITH ONLINE DOT */}
                  <div className="relative">
                    {otherUser?.profilePic ? (
                      <img
                        src={otherUser.profilePic}
                        alt="User profile "
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {isUserOnline(otherUser?._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202C33] rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium truncate">{otherUser?.name}</p>
                      <span className="text-xs text-gray-400">
                        {formatChatTime(chat.latestMessage?.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 truncate">
                      {chat.latestMessage?.content ||
                        "Hey there! I am using WhatsApp."}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showLogoutConfirm && (
        <LogoutConfirmModal
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
        ></LogoutConfirmModal>
      )}
    </div>
  );
};

export default Sidebar;
