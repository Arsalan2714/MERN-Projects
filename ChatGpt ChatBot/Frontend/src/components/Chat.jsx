import { useRef, useState } from "react";
import MessageList from "./MessageList";

const Chat = () => {
  const [conversation, setConversation] = useState(null);
  const messageInputRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageInputRef.current.value.trim()) return;

    setLoading(true);

    let url = "http://localhost:3001/api/conversation";
    if (conversation) {
      url = `${url}/${conversation._id}`;
    }

    fetch(url, {
      method: conversation ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: messageInputRef.current.value,
        model: "gpt-4o-mini",
      }),
    })
      .then((res) => res.json())
      .then((conversation) => {
        setConversation(conversation);
        messageInputRef.current.value = "";
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-800">
        <h2 className="font-medium text-gray-300">
          {conversation?.title || "New Conversation"}
        </h2>

        <button
          onClick={() => setConversation(null)}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md transition"
        >
          + New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#111827]">
        <MessageList conversation={conversation} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-4 bg-[#0f172a]">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            ref={messageInputRef}
            disabled={loading}
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;