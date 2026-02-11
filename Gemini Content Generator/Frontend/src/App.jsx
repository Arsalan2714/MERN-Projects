
import { BrowserRouter, Route, Routes} from "react-router-dom"
import ChatLayout from "./layout/ChatLayout";
import Chat from "./components/Chat";
import { ChatProvider } from "./store/ChatContext";


function App() {
  return (
    
   <BrowserRouter>
   <ChatProvider>
  <div className="min-h-screen bg-gray-100 py-8">
    <Routes>
      <Route path="/" element={<ChatLayout />} />
      <Route path="/" element={<Chat />} />
      <Route path="/conversation/:id" element={<Chat />} />
    </Routes>
  </div>
  </ChatProvider>
    </BrowserRouter>
    
  );
}

export default App;