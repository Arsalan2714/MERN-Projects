import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChatContext } from '../store/ChatContext';

const Chat = () => {
  const { id } = useParams();
  const { chats, addChat, updateChat } = useContext(ChatContext);
  const [chat, setChat] = useState(null);
  const messageRef = useRef(null);
  const modelRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setChat(chats.find(chat => chat._id === id));
    } else {
      setChat(null);
    }
  }, [id, chats]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(
      id
        ? `http://localhost:3001/api/conversation/${id}`
        : 'http://localhost:3001/api/conversation',
      {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify({
          prompt: messageRef.current.value,
          model: modelRef.current.value,
        }),
      }
    )
      .then(res => res.json())
      .then((chat) => {
        setChat(chat);
        if (id) {
          addChat(chat);
        } else {
          updateChat(chat);
        }
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Helper to format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = typeof timestamp === 'string' || typeof timestamp === 'number'
        ? new Date(timestamp)
        : timestamp;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 24px 0 24px', boxSizing: 'border-box' }}>
      {chat ? (
        <div style={{ marginBottom: '12px' }}>
          <h1 style={{ marginBottom: '8px' }}>{chat.title}</h1>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            Started: {new Date(chat.startTime).toLocaleString()}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#999', marginTop: '12px' }}>
          <h2>New Conversation</h2>
          <p>Select a conversation from the sidebar or start a new one</p>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px', paddingBottom: '120px', background: '#f8f9fd', borderRadius: '8px' }}>
        {chat && chat.messages && chat.messages.length > 0 ? (
          chat.messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  background: message.role === 'user' ? '#e6eeff' : '#ffffff',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  maxWidth: '85%',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#6972a4', fontWeight: 600, marginBottom: 6 }}>
                    {message.role === 'user' ? 'You' : 'AI'}
                  </span>
                  <span style={{
                    fontSize: '0.78rem',
                    color: '#b5bfd9',
                    marginLeft: message.role === 'user' ? 8 : 6,
                    marginRight: message.role === 'user' ? 0 : 8,
                    marginBottom: 6,
                  }}>
                    {formatTime(message.timestamp || message.time || message.createdAt)}
                  </span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', color: '#212337' }}>
                  {message.content}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#b5bfd9', fontStyle: 'italic', paddingTop: '30px' }}>
            Send message to start Conversation
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: '#fff',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 -6px 20px rgba(10,20,40,0.04)',
        }}
      >
        <input
          type="text"
          name="prompt"
          ref={messageRef}
          placeholder="Enter your message here..."
          style={{
            flex: 1,
            padding: '12px 15px',
            border: '1px solid #e0e5f2',
            borderRadius: '6px',
            fontSize: '1.02rem',
            outline: 'none',
            background: '#fff',
          }}
          onFocus={e => (e.target.style.border = '1.5px solid #4985ff')}
          onBlur={e => (e.target.style.border = '1px solid #e0e5f2')}
        />
        <select
          name="model"
          id="model"
          ref={modelRef}
          style={{
            border: '1px solid #e0e5f2',
            borderRadius: '6px',
            padding: '10px 12px',
            fontSize: '0.95rem',
            background: '#fff',
            color: '#212337',
          }}
        >
          <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
          <option value="gemini-3-flash">Gemini 3 Flash</option>
          <option value="gemini-3-pro">Gemini 3 Pro</option>
          <option value="gemini-3-pro-preview">Gemini 3 Pro Preview</option>
          <option value="gemini-3-pro-preview-2">Gemini 3 Pro Preview 2</option>
          <option value="gemini-3-pro-preview-3">Gemini 3 Pro Preview 3</option>
        </select>
        <button
          type="submit"
          style={{
            background: 'linear-gradient(90deg,#4985ff 60%,#5dcfff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;