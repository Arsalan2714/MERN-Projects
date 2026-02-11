import { useContext } from "react"
import { ChatContext } from "../store/ChatContext"
import formatTime from "../util/timeUtil.js"
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { chats } = useContext(ChatContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNewChat = () => {
    navigate("/");
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
          <div style={{ color: "#b0b5c3", textAlign: "center" }}>No chats yet.</div>
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
              </div>
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}

export default Sidebar