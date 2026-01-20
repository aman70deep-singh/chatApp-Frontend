import axiosAuth from "../api/axiosAuth.js";
import MessageInput from "./messageInput.jsx";
import ChatHeader from "./ChatHeader.jsx";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/socketContext.jsx";
import { useAuth } from "../context/authContext.jsx";
import MessagesList from "./MessagesList.jsx"

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
      if (message.chatId._id === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
        socket.emit("chat-opened", {
          chatId: message.chatId._id,
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

    socket.on("message-seen-ticks", ({ chatId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.chatId._id === chatId
            ? { ...msg, status: "seen" }
            : msg
        )
      );
    });

    return () => {
      socket.off("message-seen-ticks");
    };
  }, [socket]);


  useEffect(() => {
    if (!socket || !selectedChat || !user) return;
    socket.emit("chat-opened", {
      chatId: selectedChat._id,
    });
  }, [selectedChat, socket, user]);



  useEffect(() => {
    if (!socket || !selectedChat) return;

    socket.emit("join-chat", selectedChat._id);

    return () => {

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
      <ChatHeader otherUser={otherUser} />

      {/* MESSAGES AREA */}
      <MessagesList
        messages={messages}
        user={user}
        bottomRef={bottomRef}
      />

      {/* INPUT BOX */}
      {isTyping && <div className="text-sm text-gray-400">Typing...</div>}

      <MessageInput selectedChat={selectedChat} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
