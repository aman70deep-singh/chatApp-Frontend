import MessageInput from "./messageInput.jsx";
import { useSocket } from "../context/socketContext.jsx";
import { useAuth } from "../context/authContext.jsx";
import { useEffect, useState, useRef } from "react";
import axiosAuth from "../api/axiosAuth.js";
const ChatWindow = ({ selectedChat }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const fetchMessages = async () => {
    if (!selectedChat?._id) return;
    const response = await axiosAuth.get(`/message/${selectedChat._id}`);

    setMessages(response.data.data);
  };
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receive-message");
  }, [socket]);

  useEffect(() => {
    if (!socket || !selectedChat) return;

    socket.emit("join-chat", selectedChat._id);

    return () => {
      socket.emit("leave-chat", selectedChat._id);
    };
  }, [selectedChat, socket]);

  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages();
  }, [selectedChat]);
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a chat
      </div>
    );
  }
  const otherUser = selectedChat.userIds.find((u) => u._id !== user._id);
  return (
    <div className="flex-1 flex flex-col bg-[#EFEAE2]">
      {/* CHAT HEADER */}
      <div className="p-4 bg-[#202C33] text-white flex items-center gap-3">
        {/* Other User Profile Picture */}
        {otherUser?.profilePic ? (
          <img
            src={otherUser.profilePic}
            alt={otherUser.name || "Profile"}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold">
            {otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}

        <h2 className="font-semibold">{otherUser.name}</h2>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg) => {
          const senderId =
            typeof msg.sender === "object" ? msg.sender._id : msg.sender;
          // Convert both to strings for reliable comparison (handles ObjectId vs string mismatch)
          const isOwnMessage =
            senderId && user?._id && String(senderId) === String(user._id);

          return (
            <div
              key={msg._id}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-lg text-xl
            ${
              isOwnMessage
                ? "bg-[#DCF8C6] text-black rounded-br-none"
                : "bg-white text-black rounded-bl-none"
            }`}
              >
                <p>{msg.content}</p>

                {/* OPTIONAL: time */}
                <p className="text-[18px] text-gray-500 text-right mt-0.5">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {/* INPUT BOX */}
      <MessageInput selectedChat={selectedChat} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
