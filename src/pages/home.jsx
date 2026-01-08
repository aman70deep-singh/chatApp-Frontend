import Sidebar from "../components/sideBar";
import ChatWindow from "../components/chatWindow";
import {useState} from "react"
import { useSocket } from "../context/socketContext.jsx";
import { useAuth } from "../context/authContext.jsx";
import { useEffect } from "react";

const Home = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const {user} = useAuth();
    const socket = useSocket();
    const [onlineUsers,setOnlineUsers] = useState([])
    useEffect(() => {
        if (!socket || !user) return;
      
        socket.emit("setup", user);   
        socket.emit("user-login", user._id);
      
        socket.on("online-users", (onlineUsers) => {
          setOnlineUsers(onlineUsers);
        });
      
        return () => {
          socket.off("online-users");
        };
      }, [socket, user]);
      


    return (
        <div className="h-screen flex">
            {/*leftside bar*/}
            <Sidebar setSelectedChat={setSelectedChat} selectedChat={selectedChat} onlineUsers={onlineUsers} />
            {/*right chatting area */}
            <ChatWindow key={selectedChat?._id} selectedChat={selectedChat}    />

        </div>

    )

}
export default Home;