import axiosAuth from "../api/axiosAuth";
import { useState, useRef } from "react";
import { useSocket } from "../context/socketContext.jsx";
import { FiPlus } from "react-icons/fi";
import { IoClose, IoSend } from "react-icons/io5";
const MessageInput = ({ selectedChat, setMessages }) => {
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [typing, setTyping] = useState(false);
  const socket = useSocket();
  const fileInputRef = useRef(null);

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

  const sendImageMessage = async () => {
    try {
      if (!imageFile || !selectedChat?._id) return;
      const formData = new FormData();
      formData.append("chatId", selectedChat._id);
      formData.append("image", imageFile);

      const res = await axiosAuth.post(
        "/message/send",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const savedMessage = res.data.savedMessage;

      setMessages((prev) => [...prev, savedMessage]);
      socket.emit("send-message", savedMessage);

      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }


    } catch (error) {
      console.error("❌ Error sending image message:", error);
    }
  };


  return (

    <form
      onSubmit={sendMessage}
      className="p-3 bg-[#F0F2F5] flex items-center gap-2"
    >
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="text-xl px-2"
      >
        <FiPlus />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setImageFile(file);

            setImagePreview(URL.createObjectURL(file));

            console.log("Selected image:", file);
          }
        }}
      />

      <input
        value={newMessage}
        onChange={typingHandler}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-full outline-none"
      />
      {imagePreview && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-[#111B21] p-4 rounded-lg w-80 shadow-lg">
          <img
            src={imagePreview}
            alt="preview"
            className="w-full h-60 object-cover rounded"
          />
          <div className="flex justify-between mt-2">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
              }}
              className="text-red-400 font-semibold"
            >
              <IoClose size={20} />
            </button>

            {/* Send Button (STEP–3 me functional) */}
            <button
              type="button"
              onClick={sendImageMessage}
              className="text-green-400 font-semibold"
            >
              <IoSend size={20} />
            </button>
          </div>
        </div>
      )}


      <button
        type="submit"
        className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center"
      >
        <IoSend size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
