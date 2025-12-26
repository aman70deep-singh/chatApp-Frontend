import Sidebar from "../components/sideBar";
import ChatWindow from "../components/chatWindow";
import {useState} from "react"

const Home = () => {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div className="h-screen flex">
            {/*leftside bar*/}
            <Sidebar setSelectedChat={setSelectedChat} />
            {/*right chatting area */}
            <ChatWindow selectedChat={selectedChat} />

        </div>

    )

}
export default Home;