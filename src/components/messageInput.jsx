import axiosAuth from "../api/axiosAuth";
import { useState } from "react";
import { useSocket } from "../context/socketContext.jsx";

const MessageInput = ({ selectedChat, setMessages }) => {
  const [content, setContent] = useState("");
  const socket = useSocket();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || !socket || !selectedChat?._id) return;
    const res = await axiosAuth.post("/message/send", {
      chatId: selectedChat._id,
      content,
    });
    const newMessage = res.data.savedMessage;

    setMessages((prev) => [...prev, newMessage]);
    socket.emit("send-message", newMessage);
    setContent("");
  };
  const typingHandler = (e) => {
    setContent(e.target.value);
  };

  return (
    <form
      onSubmit={sendMessage}
      className="p-3 bg-[#F0F2F5] flex items-center gap-2"
    >
      <input
        value={content}
        onChange={typingHandler}
        placeholder="Type a message"
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
