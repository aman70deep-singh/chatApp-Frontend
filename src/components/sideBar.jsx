import { useAuth } from "../context/authContext.jsx";
import { useSocket } from "../context/socketContext.jsx";
import axiosAuth from "../api/axiosAuth.js";
import { useState, useEffect } from "react";
import ProfileModal from "./profileModal.jsx";
import LogoutConfirmModal from "./logoutConfirmModal.jsx";
import SearchBar from "./searchBar.jsx"
import SidebarHeader from "./SideBarHeader.jsx";
import ChatList from "./ChatList.jsx"
import SearchResults from "./SearchResults.jsx"

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
    if (!socket) return;

    socket.on("unread-count-updated", ({ chatId, message }) => {
      setChats(prev =>
        prev.map(chat =>
          chat._id === chatId
            ? {
              ...chat,
              unreadCount: (chat.unreadCount || 0) + 1,
              latestMessage: message
            }
            : chat
        )
      );
    });
    return () => socket.off("unread-count-updated");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("reset-unread-count", ({ chatId }) => {
      setChats(prev =>
        prev.map(chat =>
          chat._id === chatId
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      );
    });
    return () => socket.off("reset-unread-count");
  }, [socket]);


  useEffect(() => {
    fetchChats();
  }, []);
  const isSearching = search.trim().length > 0;
  return (
    <div className="w-1/4 bg-[#202C33] text-white flex flex-col">
      {/* USER HEADER */}
      <SidebarHeader
        user={user}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setShowProfile={setShowProfile}
        setShowLogoutConfirm={setShowLogoutConfirm}
      />

      {/* SEARCH BAR */}
      <SearchBar
        search={search}
        onSearch={searchUsers}
      />

      {/* SEARCH RESULTS */}
      <SearchResults
        search={search}
        loading={loading}
        searchResults={searchResults}
        accessChat={accessChat}
        formatChatTime={formatChatTime}
      />

      {/* CHAT LIST */}
      {!isSearching && (
        <ChatList
          chats={chats}
          loading={loading}
          user={user}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          isUserOnline={isUserOnline}
          formatChatTime={formatChatTime}
        />
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
