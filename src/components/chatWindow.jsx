import axiosAuth from "../api/axiosAuth.js";
import MessageInput from "./messageInput.jsx";
import ChatHeader from "./ChatHeader.jsx";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "../context/socketContext.jsx";
import { useAuth } from "../context/authContext.jsx";
import MessagesList from "./MessagesList.jsx"

const ChatWindow = ({ selectedChat }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const loadingRef = useRef(false);

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
    if (messages.length > 0) {
      const currentLastMessageId = messages[messages.length - 1]._id;
      if (!lastMessageIdRef.current || lastMessageIdRef.current !== currentLastMessageId) {
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: "auto" });
        }
      }
      lastMessageIdRef.current = currentLastMessageId;
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
    if (!socket) return;

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isDeleted: true, content: "This message was deleted", type: "text", imageUrl: undefined } : msg
        )
      );
    };

    socket.on("message-deleted", handleMessageDeleted);

    return () => {
      socket.off("message-deleted", handleMessageDeleted);
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

  const fetchMessages = useCallback(async (cursor = null) => {
    if (!selectedChat?._id || loadingRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);
    try {
      const url = `/message/${selectedChat._id}?limit=20${cursor ? `&cursor=${cursor}` : ""}`;
      const response = await axiosAuth.get(url);
      const { messages: fetchedMessages, nextCursor, hasNextPage } = response.data.data;
      const orderedMessages = [...fetchedMessages].reverse();

      if (cursor) {
        setMessages((prev) => [...orderedMessages, ...prev]);
      } else {
        setMessages(orderedMessages);
      }

      setNextCursor(nextCursor);
      setHasNextPage(hasNextPage);
    } catch (error) {
      console.error("Fetch Messages Error:", error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [selectedChat?._id]);

  const handleDeleteMessage = useCallback(async (messageId, type) => {
    try {
      await axiosAuth.delete(`/message/${messageId}`, { data: { type } });
      if (type === "me") {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }
    } catch (error) {
      console.error("Delete Message Error:", error);
    }
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setMessages([]);
      setNextCursor(null);
      setHasNextPage(false);
      fetchMessages();
    }
  }, [selectedChat, fetchMessages]);
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
        onLoadMore={() => fetchMessages(nextCursor)}
        onDeleteMessage={handleDeleteMessage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
      />

      {/* INPUT BOX */}
      {isTyping && <div className="text-sm text-gray-400">Typing...</div>}

      <MessageInput selectedChat={selectedChat} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
