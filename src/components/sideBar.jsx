import { useAuth } from "../context/authContext.jsx";
import axiosAuth from "../api/axiosAuth.js";
import { useState, useEffect } from "react";

const Sidebar = ({ setSelectedChat }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
    fetchChats();
  }, []);

  return (
    <div className="w-1/4 bg-[#202C33] text-white flex flex-col">
      {/* USER HEADER */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        {/* Profile Picture */}
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name || "Profile"}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold">{user?.name || "User"}</h2>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      {/* CHAT LIST (dummy for now) */}
      <div className="flex-1 overflow-y-auto">
        {loading && <p className="p-4 text-gray-400">Loading...</p>}
        {!loading && chats.length == 0 && (
          <p className="p-4 text-gray-400">No chats found</p>
        )}

        {!loading &&
          chats.map((chat) => {
            const otherUser = chat.userIds?.find((u) => u._id !== user?._id);
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className="p-4 hover:bg-[#2A3942] cursor-pointer border-b border-gray-700"
              >
                <p className="font-medium">{otherUser?.name || "Group Chat"}</p>
                <p className="text-sm text-gray-400 truncate">
                  {chat.latestMessage?.content || "No messages yet"}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Sidebar;
