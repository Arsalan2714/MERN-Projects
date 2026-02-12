import { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatContext } from '../store/ChatContext';
import ReactMarkdown from 'react-markdown';

// FormattedMessage component with better spacing
const FormattedMessage = ({ content }) => {
  if (!content) return null;

  const formatText = (text) => {
    // Split text into paragraphs first
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs;
  };

  const formatInlineText = (text) => {
    const elements = [];
    let currentIndex = 0;
    
    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, style: 'bold' },
      { regex: /__(.*?)__/g, style: 'underline' },
      { regex: /`([^`]+)`/g, style: 'inline-code' },
    ];

    const allMatches = [];
    patterns.forEach(({ regex, style }) => {
      let match;
      const re = new RegExp(regex.source, regex.flags);
      while ((match = re.exec(text)) !== null) {
        allMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          style
        });
      }
    });

    allMatches.sort((a, b) => a.start - b.start);

    let usedRanges = [];
    allMatches.forEach((match) => {
      // Check if this match overlaps with any used range
      const overlaps = usedRanges.some(
        range => match.start < range.end && match.end > range.start
      );
      
      if (!overlaps) {
        if (match.start > currentIndex) {
          elements.push({
            type: 'text',
            content: text.slice(currentIndex, match.start)
          });
        }

        elements.push({
          type: match.style,
          content: match.content
        });

        usedRanges.push({ start: match.start, end: match.end });
        currentIndex = match.end;
      }
    });

    if (currentIndex < text.length) {
      elements.push({
        type: 'text',
        content: text.slice(currentIndex)
      });
    }

    if (elements.length === 0) {
      elements.push({ type: 'text', content: text });
    }

    return elements;
  };

  const paragraphs = formatText(content);

  return (
    <div>
      {paragraphs.map((paragraph, pIndex) => {
        // Check if it's a code block
        if (paragraph.trim().startsWith('```') && paragraph.trim().endsWith('```')) {
          const code = paragraph.trim().slice(3, -3).trim();
          return (
            <pre
              key={pIndex}
              style={{
                background: '#f5f5f5',
                padding: '12px',
                borderRadius: '6px',
                overflowX: 'auto',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                border: '1px solid #e0e0e0',
                margin: '10px 0',
                lineHeight: '1.5'
              }}
            >
              <code>{code}</code>
            </pre>
          );
        }

        // Check if it's a numbered list or bullet point
        const lines = paragraph.split('\n');
        const isList = lines.every(line => 
          /^\d+\./.test(line.trim()) || /^[-•*]/.test(line.trim()) || line.trim() === ''
        );

        if (isList && lines.length > 1) {
          return (
            <div key={pIndex} style={{ margin: '10px 0' }}>
              {lines.map((line, lIndex) => {
                if (!line.trim()) return null;
                const inlineElements = formatInlineText(line);
                return (
                  <div key={lIndex} style={{ marginBottom: '6px', paddingLeft: '4px' }}>
                    {inlineElements.map((element, i) => {
                      switch (element.type) {
                        case 'bold':
                          return <strong key={i} style={{ fontWeight: 700, color: '#000' }}>{element.content}</strong>;
                        case 'underline':
                          return <u key={i} style={{ textDecoration: 'underline', textDecorationColor: '#4985ff', textDecorationThickness: '2px' }}>{element.content}</u>;
                        case 'inline-code':
                          return (
                            <code
                              key={i}
                              style={{
                                background: '#f0f0f0',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.9em',
                                fontFamily: 'monospace',
                                color: '#d63384',
                                border: '1px solid #e0e0e0'
                              }}
                            >
                              {element.content}
                            </code>
                          );
                        default:
                          return <span key={i}>{element.content}</span>;
                      }
                    })}
                  </div>
                );
              })}
            </div>
          );
        }

        // Regular paragraph
        const inlineElements = formatInlineText(paragraph);
        return (
          <p key={pIndex} style={{ margin: '8px 0', lineHeight: '1.7' }}>
            {inlineElements.map((element, i) => {
              switch (element.type) {
                case 'bold':
                  return <strong key={i} style={{ fontWeight: 700, color: '#000' }}>{element.content}</strong>;
                case 'underline':
                  return <u key={i} style={{ textDecoration: 'underline', textDecorationColor: '#4985ff', textDecorationThickness: '2px' }}>{element.content}</u>;
                case 'inline-code':
                  return (
                    <code
                      key={i}
                      style={{
                        background: '#f0f0f0',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.9em',
                        fontFamily: 'monospace',
                        color: '#d63384',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      {element.content}
                    </code>
                  );
                default:
                  return <span key={i}>{element.content}</span>;
              }
            })}
          </p>
        );
      })}
    </div>
  );
};

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chats, addChat, updateChat } = useContext(ChatContext);
  const [chat, setChat] = useState(null);
  const messageRef = useRef(null);
  const modelRef = useRef(null);
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const foundChat = chats.find(chat => chat._id === id);
      setChat(foundChat || null);
    } else {
      setChat(null);
    }
  }, [id, chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const messageText = messageRef.current.value.trim();
    if (!messageText) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError(null);
    
    const url = id
      ? `http://localhost:3001/api/conversation/${id}`
      : 'http://localhost:3001/api/conversation';
    
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: messageText,
        model: modelRef.current.value,
      }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((responseChat) => {
        setChat(responseChat);
        
        if (id) {
          updateChat(responseChat);
        } else {
          addChat(responseChat);
          navigate(`/conversation/${responseChat._id}`);
        }
        
        messageRef.current.value = '';
      })
      .catch((err) => {
        console.error('Error:', err);
        setError(err.message || 'Failed to send message. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = typeof timestamp === 'string' || typeof timestamp === 'number'
        ? new Date(timestamp)
        : timestamp;
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      padding: '24px 24px 0 24px', 
      boxSizing: 'border-box' 
    }}>
      {chat ? (
        <div style={{ marginBottom: '12px' }}>
          <h1 style={{ marginBottom: '8px', fontSize: '1.5rem' }}>{chat.title}</h1>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            Started: {new Date(chat.startTime).toLocaleString()}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#999', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>New Conversation</h2>
          <p style={{ fontSize: '1rem' }}>Start chatting with AI</p>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '12px',
          border: '1px solid #fcc'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '18px', 
        paddingBottom: '24px',
        background: '#f8f9fd', 
        borderRadius: '8px',
        marginBottom: '12px'
      }}>
        {chat && chat.messages && chat.messages.length > 0 ? (
          <>
            {chat.messages.map((message, index) => {
              // Get timestamp - try multiple field names
              const timestamp = message.timestamp || message.time || message.createdAt || message.date || new Date();
              
              return (
                <div
                  key={index}
                  style={{
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      background: message.role === 'user' ? '#e6eeff' : '#ffffff',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      maxWidth: '75%',
                      boxShadow: message.role === 'user' 
                        ? '0 2px 8px rgba(73, 133, 255, 0.15)' 
                        : '0 2px 8px rgba(0,0,0,0.08)',
                      border: message.role === 'user' 
                        ? '1px solid #d4e3ff' 
                        : '1px solid #f0f0f0',
                    }}
                  >
                    {/* Header with role and time */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid rgba(0,0,0,0.06)'
                    }}>
                      <span style={{ 
                        fontSize: '0.88rem', 
                        color: message.role === 'user' ? '#4985ff' : '#666', 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {message.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
                      </span>
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#999',
                        fontWeight: 500,
                      }}>
                        {formatTime(timestamp)}
                      </span>
                    </div>

                    {/* Message content */}
                    <div style={{ 
                      color: '#212337', 
                      lineHeight: '1.7',
                      fontSize: '0.95rem'
                    }}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#b5bfd9', 
            fontStyle: 'italic', 
            paddingTop: '30px',
            fontSize: '1.1rem'
          }}>
            {loading ? 'Sending your message...' : 'Send a message to start the conversation'}
          </div>
        )}
        
        {loading && chat?.messages?.length > 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#4985ff', 
            marginTop: '12px',
            fontStyle: 'italic'
          }}>
            AI is typing...
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 -6px 20px rgba(10,20,40,0.04)',
          marginBottom: '12px'
        }}
      >
        <input
          type="text"
          name="prompt"
          ref={messageRef}
          placeholder="Enter your message here..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 15px',
            border: '1px solid #e0e5f2',
            borderRadius: '6px',
            fontSize: '1.02rem',
            outline: 'none',
            background: '#fff',
            opacity: loading ? 0.6 : 1,
          }}
          onFocus={e => (e.target.style.border = '1.5px solid #4985ff')}
          onBlur={e => (e.target.style.border = '1px solid #e0e5f2')}
        />
        <select
          name="model"
          id="model"
          ref={modelRef}
          disabled={loading}
          style={{
            border: '1px solid #e0e5f2',
            borderRadius: '6px',
            padding: '10px 12px',
            fontSize: '0.95rem',
            background: '#fff',
            color: '#212337',
            opacity: loading ? 0.6 : 1,
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
          disabled={loading}
          style={{
            background: loading ? '#ccc' : 'linear-gradient(90deg,#4985ff 60%,#5dcfff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;