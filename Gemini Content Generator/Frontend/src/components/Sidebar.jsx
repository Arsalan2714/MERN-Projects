import { useContext } from "react"
import { ChatContext } from "../store/ChatContext"
import  formatTime  from "../util/timeUtil.js"
import { Link } from "react-router-dom";

const Sidebar = () => {
    const {chats} = useContext(ChatContext);

  return (<>
    <div> Gemini Content Generator </div>
    <button>New Chat</button>
    {
        chats.map(chat => (
          
            <Link to={`/conversation/${chat._id}`}>
           <div>{chat.title}</div>
           <div>{formatTime(chat.startTime)}</div>
           </Link>
        ))
    }
    </>
  )
}

export default Sidebar