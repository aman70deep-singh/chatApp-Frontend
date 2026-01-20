const MessagesList = ({ messages, user, bottomRef }) => {
    return (
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
                            className={`relative max-w-[70%] overflow-hidden
                ${msg.type === "image"
                                    ? ""
                                    : isOwnMessage
                                        ? "bg-[#DCF8C6] text-black rounded-lg rounded-br-none"
                                        : "bg-white text-black rounded-lg rounded-bl-none"
                                }`}
                        >
                            {/* IMAGE MESSAGE */}
                            {msg.type === "image" ? (
                                <div className="relative">
                                    <img
                                        src={msg.imageUrl}
                                        alt="sent"
                                        className="max-w-[260px] max-h-[300px] rounded-lg object-cover cursor-pointer"
                                        onClick={() => window.open(msg.imageUrl, "_blank")}
                                    />

                                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                                        <span>
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>

                                        {isOwnMessage && (
                                            <>
                                                {msg.status === "sent" && <span>✔</span>}
                                                {msg.status === "delivered" && <span>✔✔</span>}
                                                {msg.status === "seen" && (
                                                    <span className="text-blue-400">✔✔</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* TEXT MESSAGE */
                                <div className="px-3 py-2 text-xl relative">
                                    <p>{msg.content}</p>

                                    <div className="flex justify-end items-center gap-1 text-xs text-gray-500 mt-1">
                                        <span>
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>

                                        {isOwnMessage && (
                                            <>
                                                {msg.status === "sent" && <span>✔</span>}
                                                {msg.status === "delivered" && <span>✔✔</span>}
                                                {msg.status === "seen" && (
                                                    <span className="text-blue-500">✔✔</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            <div ref={bottomRef} />
        </div>
    );
};

export default MessagesList;
