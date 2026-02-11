import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
    const [chats, setChats]  = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:3001/api/conversation",{
            method: "GET",
        })
        .then(res => res.json())
        .then((chats) => {
            setChats(chats);
        }).catch((err)=> {
            setError(err);
        }).finally(() => {
            setLoading(false);
        })
    }, []);

    const addChat = (chat) => {
        setChats([...chats, chat]);      
    };
    const deleteChat = (id) => {
        setChats(chats.filter(chat => chat._id !== id));
    };
    const updateChat = (updateChat) => {
        setChats(chats.map(chat => chat._id ===  updateChat._id ? updateChat : chat)); 
    };

    return (
        <ChatContext.Provider value={{chats, loading, error, addChat, deleteChat, updateChat}}>
            {loading ? (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                    <span>Loading...</span>
                </div>
            ) : error ? (
                <div style={{ color: "red", textAlign: "center", padding: "1rem" }}>
                    Error: {error.message ? error.message : "Something went wrong!"}
                </div>
            ) : (
                children
            )}
        </ChatContext.Provider>
     );
};