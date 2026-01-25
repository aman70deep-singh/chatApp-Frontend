import { useRef, useLayoutEffect, useState } from "react";
import Spinner from "./Spinner";
import { MdBlock } from "react-icons/md";
import { MdKeyboardArrowDown, MdDelete } from "react-icons/md";
const MessagesList = ({ messages, user, bottomRef, onLoadMore, onDeleteMessage, hasNextPage, isLoading }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const containerRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const prevFirstMessageIdRef = useRef(null);
    useLayoutEffect(() => {
        if (!containerRef.current) return;
        const currentFirstMessageId = messages.length > 0 ? messages[0]._id : null;
        if (
            prevFirstMessageIdRef.current &&
            currentFirstMessageId !== prevFirstMessageIdRef.current &&
            !isLoading
        ) {
            const scrollDiff = containerRef.current.scrollHeight - prevScrollHeightRef.current;
            containerRef.current.scrollTop += scrollDiff;
        }
        prevScrollHeightRef.current = containerRef.current.scrollHeight;
        prevFirstMessageIdRef.current = currentFirstMessageId;
    }, [messages, isLoading]);
    const handleScroll = () => {
        if (!containerRef.current) return;

        if (containerRef.current.scrollTop <= 5 && hasNextPage && !isLoading) {
            onLoadMore();
        }
    }

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 p-4 overflow-y-auto space-y-2">
            {isLoading && (
                <Spinner className="py-4" />
            )}
            {messages.map((msg) => {
                const senderId =
                    typeof msg.sender === "object" ? msg.sender._id : msg.sender;

                const isOwnMessage =
                    senderId && user?._id && String(senderId) === String(user._id);

                return (
                    <div
                        key={msg._id}
                        className={`flex group relative ${isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`relative max-w-[70%]
                ${msg.isDeleted
                                    ? "bg-gray-100 text-gray-500 rounded-lg italic border border-gray-200"
                                    : msg.type === "image"
                                        ? ""
                                        : isOwnMessage
                                            ? "bg-[#DCF8C6] text-black rounded-lg rounded-br-none"
                                            : "bg-white text-black rounded-lg rounded-bl-none"
                                }`}
                        >
                            {msg.isDeleted ? (
                                <div className="px-3 py-2 flex items-center gap-2 opacity-100">
                                    <span className="text-sm"><MdBlock className="text-red-500" /> This message was deleted</span>
                                    <span className="text-[10px] text-gray-400 mt-1">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            ) : (
                                <>
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
                                </>
                            )}


                            {/* DELETE MENU BUTTON */}
                            {!msg.isDeleted && (
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === msg._id ? null : msg._id)}
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
                                >
                                    <MdKeyboardArrowDown size={20} />
                                </button>
                            )}

                            {/* DELETE MENU */}
                            {openMenuId === msg._id && (
                                <div className="absolute top-7 right-1 bg-white shadow-lg border rounded-md py-1 z-10 min-w-[150px]">
                                    <button
                                        onClick={() => {
                                            onDeleteMessage(msg._id, "me");
                                            setOpenMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <MdDelete className="text-gray-400" />
                                        Delete for me
                                    </button>
                                    {isOwnMessage && (
                                        <button
                                            onClick={() => {
                                                onDeleteMessage(msg._id, "everyone");
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                        >
                                            <MdDelete />
                                            Delete for everyone
                                        </button>
                                    )}
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
