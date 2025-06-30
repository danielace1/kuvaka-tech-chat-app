import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { formatTimestamp } from "../utils/formatDate";

const WEB_SOCKET_URL = import.meta.env.VITE_WEB_SOCKET_URL;
// const WEB_SOCKET_URL = import.meta.env.VITE_WEB_SOCKET_URL_PROD;

const Chat = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const username = state?.username;
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Redirect if username is not provided
    if (!username) {
      navigate("/");
      return;
    }

    // Connect to WebSocket server
    const socket = new WebSocket(WEB_SOCKET_URL);
    socketRef.current = socket;

    // Send initial message
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "init", username }));
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "history") {
        setMessages(data.messages);
      } else if (data.type === "message") {
        setMessages((prev) => [...prev, data]);
      }
    };

    // socket.onclose = () => {
    //   console.log("Disconnected from server");
    // };

    return () => socket.close();
  }, [username, navigate]);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSend = () => {
    if (message.trim()) {
      socketRef.current.send(JSON.stringify({ type: "message", message }));
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <header className="sticky top-0 z-10 bg-blue-600 text-white flex justify-between items-center px-3 py-2 md:px-6 md:py-4 shadow-md">
        <div className="text-lg md:text-xl font-semibold">
          💬 Real-Time Chat -{" "}
          <span className="font-normal">Welcome, {username}</span>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to leave the chat?")) {
              socketRef.current?.close();
              navigate("/");
            }
          }}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded-md cursor-pointer"
        >
          Leave
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, idx) => {
          const isUser = msg.username === username;
          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow ${
                  isUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <div
                  className={`font-semibold text-xs mb-1 ${
                    isUser ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  {isUser ? "You" : msg.username}
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {msg.message}{" "}
                  <sub
                    className={`text-[10px] ml-1 ${
                      isUser ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </sub>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </main>

      <footer className="sticky bottom-0 bg-white border-t px-4 py-3 flex items-center gap-2 shadow-inner">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 px-4 py-2 rounded-full outline-none focus:border-blue-400 transition"
        />
        <button
          disabled={!message.trim()}
          onClick={handleSend}
          className={`px-5 py-2 rounded-full font-medium transition ${
            message.trim()
              ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
