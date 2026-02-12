import { useContext } from "react"
import { ChatContext } from "../store/ChatContext"
import formatTime from "../util/timeUtil.js"
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { chats, deleteChat } = useContext(ChatContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNewChat = () => {
    navigate("/");
  }

  const handleDeleteChat = async (e, chatId) => {
    e.preventDefault(); // Prevent navigation when clicking delete
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/conversation/${chatId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        deleteChat(chatId);
        // If we're currently viewing this chat, navigate to home
        if (location.pathname === `/conversation/${chatId}`) {
          navigate("/");
        }
      } else {
        alert("Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Error deleting chat");
    }
  }

  return (
    <aside
      style={{
        width: "300px",
        height: "100vh",
        background: "#1e222c",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        boxSizing: "border-box",
        borderRight: "1px solid #34384a",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "1.25rem",
          marginBottom: "2rem",
          letterSpacing: "1px",
          textAlign: "center",
        }}
      >
        Talk to Ai
      </div>
      <button
        onClick={handleNewChat}
        style={{
          background: "#4985ff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "0.75rem 1rem",
          fontSize: "1rem",
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: "0px 2px 8px rgba(73, 133, 255, 0.08)",
          marginBottom: "2rem",
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => e.target.style.background = "#3d75e6"}
        onMouseOut={(e) => e.target.style.background = "#4985ff"}
      >
        + New Chat
      </button>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {chats.length === 0 ? (
          <div style={{ color: "#b0b5c3", textAlign: "center", marginTop: "2rem" }}>
            No chats yet. Start a new conversation!
          </div>
        ) : (
          chats.map(chat => (
            <Link
              key={chat._id}
              to={`/conversation/${chat._id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "7px",
                  background:
                    location.pathname === `/conversation/${chat._id}`
                      ? "#2a3142"
                      : "#212534",
                  transition: "background 0.15s",
                  cursor: "pointer",
                  marginBottom: "2px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow:
                    location.pathname === `/conversation/${chat._id}`
                      ? "0 2px 8px rgba(73, 133, 255, 0.10)"
                      : "none",
                  border:
                    location.pathname === `/conversation/${chat._id}`
                      ? "1.5px solid #4985ff"
                      : "1px solid #23283a",
                }}
              >
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: "1.05rem",
                    marginBottom: "0.25em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    paddingRight: "30px",
                  }}
                  title={chat.title}
                >
                  {chat.title}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#aac2ef",
                  }}
                  title={formatTime(chat.startTime)}
                >
                  {formatTime(chat.startTime)}
                </div>
                
                {/* Delete button */}
                <button
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#ff6b6b",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    opacity: 0.7,
                    transition: "opacity 0.2s, background 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.opacity = 1;
                    e.target.style.background = "rgba(255, 107, 107, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = 0.7;
                    e.target.style.background = "transparent";
                  }}
                  title="Delete chat"
                >
                  🗑️
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}

export default Sidebar