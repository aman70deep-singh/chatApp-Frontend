import MessageInput from "./messageInput.jsx";
import { useSocket } from "../context/socketContext.jsx";
import { useAuth } from "../context/authContext.jsx";
import { useEffect, useState, useRef } from "react";
import axiosAuth from "../api/axiosAuth.js";
const ChatWindow = ({ selectedChat }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);




  useEffect(() => {
    if (!socket) return;
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
    return () => {
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [socket]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      console.log("📩 receive-message:", message);


      if (message.chatId._id === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
        socket.emit("chat-opened", {
          chatId: message.chatId._id,
          userId: user._id,
        });

      }
      else {
        console.log("message for another chat ");
      }


    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdated = ({ messageId, status }) => {
      console.log("✔ status-updated:", messageId, status);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status } : msg
        )
      );
    };

    socket.on("message-status-updated", handleStatusUpdated);

    return () => {
      socket.off("message-status-updated", handleStatusUpdated);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleSeen = ({ chatId }) => {
      console.log("🔵 message-seen received for chat:", chatId);


      setMessages((prev) =>
        prev.map((msg) =>
          msg.chatId._id === chatId
            ? { ...msg, status: "seen" }
            : msg
        )
      );
    };

    socket.on("message-seen", handleSeen);

    return () => {
      socket.off("message-seen", handleSeen);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !selectedChat || !user) return;
    console.log("👀 emitting chat-opened:", selectedChat._id);


    socket.emit("chat-opened", {
      chatId: selectedChat._id,
      userId: user._id,
    });
  }, [selectedChat, socket, user]);



  useEffect(() => {
    if (!socket || !selectedChat) return;
    console.log("➡️ emitting join-chat:", selectedChat._id);

    socket.emit("join-chat", selectedChat._id);

    return () => {
      console.log("⬅️ emitting leave-chat:", selectedChat._id);

      socket.emit("leave-chat", selectedChat._id);
    };
  }, [selectedChat, socket]);

  useEffect(() => {
    if (!selectedChat) return;
    const fetchMessages = async () => {
      if (!selectedChat?._id) return;
      const response = await axiosAuth.get(`/message/${selectedChat._id}`);
      setMessages(response.data.data);
    };
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
    <div className="flex-1 flex flex-col bg-[#EFEAE2] transition-all duration-200">
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
          const isOwnMessage =
            senderId && user?._id && String(senderId) === String(user._id);

          return (
            <div
              key={msg._id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`relative max-w-[70%] px-3 py-2 rounded-lg text-xl
            ${isOwnMessage
                    ? "bg-[#DCF8C6] text-black rounded-br-none"
                    : "bg-white text-black rounded-bl-none"
                  }`}
              >
                <p>{msg.content}</p>
                {isOwnMessage && (
                  <span className="absolute bottom-1 right-1 text-xs flex items-center gap-1">
                    {msg.status === "sent" && <span>✔</span>}
                    {msg.status === "delivered" && <span>✔✔</span>}
                    {msg.status === "seen" && <span className="text-blue-500">✔✔</span>}
                  </span>
                )}



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
      {isTyping && <div className="text-sm text-gray-400">Typing...</div>}

      <MessageInput selectedChat={selectedChat} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
