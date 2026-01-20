const ChatList = ({
  chats,
  loading,
  user,
  selectedChat,
  setSelectedChat,
  isUserOnline,
  formatChatTime,
}) => {
  if (loading) {
    return <p className="p-4 text-gray-400">Loading...</p>;
  }

  if (!chats.length) {
    return <p className="p-4 text-gray-400">No chats found</p>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => {
        const otherUser = chat.userIds?.find(
          (u) => u._id !== user?._id
        );

        return (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className={`p-4 cursor-pointer border-b border-gray-700 flex gap-3
              ${
                selectedChat?._id === chat._id
                  ? "bg-[#2A3942]"
                  : "hover:bg-[#2A3942]"
              }`}
          >
            {/* AVATAR */}
            <div className="relative">
              {otherUser?.profilePic ? (
                <img
                  src={otherUser.profilePic}
                  alt="User profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                  {otherUser?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* ONLINE DOT */}
              {isUserOnline(otherUser?._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202C33] rounded-full"></span>
              )}
            </div>

            {/* CHAT INFO */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="font-medium truncate">{otherUser?.name}</p>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {formatChatTime(chat.latestMessage?.createdAt)}
                  </span>

                  {chat.unreadCount > 0 && (
                    <span className="bg-green-500 text-black text-xs px-2 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
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
  );
};

export default ChatList;
