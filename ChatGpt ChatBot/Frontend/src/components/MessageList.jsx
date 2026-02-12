import ReactMarkdown from "react-markdown";

const MessageList = ({ conversation }) => {

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-lg">
        Start a conversation 👋
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {conversation.messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${
            message.role === "assistant" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-md ${
              message.role === "assistant"
                ? "bg-gray-800 text-gray-100 rounded-bl-none"
                : "bg-blue-600 text-white rounded-br-none"
            }`}
          >
            <ReactMarkdown className="whitespace-pre-wrap">
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;