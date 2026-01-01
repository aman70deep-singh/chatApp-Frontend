import Sidebar from "../components/sideBar";
import ChatWindow from "../components/chatWindow";
import {useState} from "react"

const Home = () => {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div className="h-screen flex">
            {/*leftside bar*/}
            <Sidebar setSelectedChat={setSelectedChat} selectedChat={selectedChat} />
            {/*right chatting area */}
            <ChatWindow key={selectedChat?._id} selectedChat={selectedChat}    />

        </div>

    )

}
export default Home;