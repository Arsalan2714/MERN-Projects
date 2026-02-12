import Chat from "./components/Chat";

function App() {
  return (
    <div className="h-screen bg-[#0f172a] text-white flex flex-col">
      <header className="py-4 border-b border-gray-800 text-center text-xl font-semibold tracking-wide">
        🤖 AI Chatbot
      </header>

      <div className="flex-1 overflow-hidden">
        <Chat />
      </div>
    </div>
  );
}

export default App;