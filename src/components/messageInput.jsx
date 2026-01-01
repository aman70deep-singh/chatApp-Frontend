import axiosAuth from "../api/axiosAuth";
import { useState } from "react";
import { useSocket } from "../context/socketContext.jsx";

const MessageInput = ({ selectedChat, setMessages }) => {
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const socket = useSocket();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedChat?._id) return;
    const res = await axiosAuth.post("/message/send", {
      chatId: selectedChat._id,
      content: newMessage,
    });
    const savedMessage = res.data.savedMessage;

    setMessages((prev) => [...prev, savedMessage]);
    socket.emit("send-message", savedMessage);

    setNewMessage("");
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socket) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <form
      onSubmit={sendMessage}
      className="p-3 bg-[#F0F2F5] flex items-center gap-2"
    >
      <input
        value={newMessage}
        onChange={typingHandler}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-full outline-none"
      />

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-full"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
