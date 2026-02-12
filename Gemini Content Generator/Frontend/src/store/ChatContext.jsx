import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:3001/api/conversation", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((chats) => {
            // Sort chats by start time, newest first
            const sortedChats = chats.sort((a, b) => 
                new Date(b.startTime) - new Date(a.startTime)
            );
            setChats(sortedChats);
            setError(null);
        })
        .catch((err) => {
            console.error("Error fetching chats:", err);
            setError(err);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    const addChat = (chat) => {
        // Check if chat already exists
        const chatExists = chats.some(c => c._id === chat._id);
        if (!chatExists) {
            // Add new chat at the beginning (most recent first)
            setChats([chat, ...chats]);
        }
    };

    const deleteChat = (id) => {
        setChats(chats.filter(chat => chat._id !== id));
    };

    const updateChat = (updatedChat) => {
        setChats(chats.map(chat => 
            chat._id === updatedChat._id ? updatedChat : chat
        )); 
    };

    return (
        <ChatContext.Provider value={{ 
            chats, 
            loading, 
            error, 
            addChat, 
            deleteChat, 
            updateChat 
        }}>
            {loading ? (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #e0e5f2',
                        borderTop: '4px solid #4985ff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <span style={{ fontSize: '1.2rem', color: '#4985ff' }}>
                        Loading chats...
                    </span>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            ) : error ? (
                <div style={{ 
                    color: '#c33', 
                    textAlign: 'center', 
                    padding: '2rem',
                    background: '#fee',
                    borderRadius: '8px',
                    margin: '2rem',
                    maxWidth: '500px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '10vh'
                }}>
                    <h3 style={{ marginBottom: '1rem' }}>⚠️ Error Loading Chats</h3>
                    <p style={{ marginBottom: '1.5rem' }}>
                        {error.message || "Something went wrong!"}
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            background: '#4985ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 500
                        }}
                    >
                        🔄 Retry
                    </button>
                </div>
            ) : (
                children
            )}
        </ChatContext.Provider>
    );
};