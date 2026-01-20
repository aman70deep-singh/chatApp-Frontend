const ChatHeader = ({ otherUser }) => {
  if (!otherUser) return null;

  return (
    <div className="p-4 bg-[#202C33] text-white flex items-center gap-3">
      {otherUser?.profilePic ? (
        <img
          src={otherUser.profilePic}
          alt={otherUser.name || "Profile"}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold">
          {otherUser?.name
            ? otherUser.name.charAt(0).toUpperCase()
            : "U"}
        </div>
      )}

      <h2 className="font-semibold">{otherUser.name}</h2>
    </div>
  );
};

export default ChatHeader;
