const SearchResults = ({
    search,
    loading,
    searchResults,
    accessChat,
    formatChatTime,
}) => {
    if (!search) return null;

    return (
        <div className="border-b border-gray-700">
            {loading && <p className="p-4 text-gray-400">Searching...</p>}

            {!loading && searchResults.length === 0 && (
                <p className="p-4 text-gray-400">No users found</p>
            )}

            {!loading &&
                searchResults.map((u) => (
                    <div
                        key={u._id}
                        onClick={() => accessChat(u._id)}
                        className="p-4 hover:bg-[#2A3942] cursor-pointer flex gap-3"
                    >
                        {/* Avatar */}
                        {u.profilePic ? (
                            <img
                                src={u.profilePic}
                                alt={u.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-semibold">
                                {u.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <p className="font-medium truncate">{u.name}</p>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {u.latestMessage?.createdAt &&
                                        formatChatTime(u.latestMessage.createdAt)}
                                </span>
                            </div>

                            <p className="text-sm text-gray-400 truncate">
                                {u.latestMessage?.content ??
                                    u.bio ??
                                    "Start a new chat"}
                            </p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default SearchResults;
