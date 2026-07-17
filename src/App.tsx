import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import TextField from './comps/TextField'
import NameHandler from './comps/NameHandler';
import TextCardHandler from './comps/TextCardHandler';

const socketUrl = import.meta.env.VITE_SOCKET_URL || `${window.location.protocol}//${window.location.hostname}:3001`;
const socket = io(socketUrl, { transports: ['websocket'] });

type Message = {
  id: number;
  sender: string;
  text: string;
};

function App() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const usernameRef = useRef<string>("Guest");
  const typingTimeoutRef = useRef<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  
  // NEW: State to hold the current user's name
  const [username, setUsername] = useState<string>("Guest");

  // NEW: Ask for their name when the app first loads
  useEffect(() => {
    const enteredName = prompt("Enter your chat name:") || "Guest";
    setUsername(enteredName);
    usernameRef.current = enteredName;
  }, []);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("typing_started", ({ sender }: { sender: string }) => {
      setTypingUser(sender);

      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = window.setTimeout(() => {
        setTypingUser(null);
      }, 1200);
    });

    socket.on("typing_stopped", ({ sender }: { sender: string }) => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      setTypingUser((current) => (current === sender ? null : current));
    });

    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      socket.off("receive_message");
      socket.off("typing_started");
      socket.off("typing_stopped");
    };
  }, []);

  const handleTypingChange = (isTyping: boolean) => {
    if (isTyping) {
      socket.emit("typing_started", { sender: usernameRef.current });
    } else {
      socket.emit("typing_stopped", { sender: usernameRef.current });
    }
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      sender: username,
      text: text
    };

    handleTypingChange(false);
    socket.emit("send_message", newMessage);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="card text-center m-2 w-100 d-flex flex-column overflow-hidden" style={{ height: 'calc(100dvh - 1rem)' }}>
      {/* Pass the dynamic username to the top bar */}
      <NameHandler name={username} />

      <div className="card-body flex-grow-1 d-flex flex-column p-3" style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <div className="mb-3">
            <h5 className="card-title">It's a bit too quiet here</h5>
            <p className="card-text">Send a message to break the ice ❄.</p>
          </div>
        )}

        <div ref={chatContainerRef} className="flex-grow-1 overflow-auto px-2 py-1 chat-scroll" style={{ minHeight: 0 }}>
          {messages.map((message) => (
            <TextCardHandler key={message.id} currentUser={username} sender={message.sender} text={message.text} />
          ))}
        </div>
      </div>

      <div className="card-footer border-0 bg-transparent px-3 pb-3 pt-2 flex-shrink-0">
        <div className={`typing-indicator ${typingUser ? 'show' : ''}`} aria-live="polite">
          <span>{typingUser ? `${typingUser} is typing` : ''}</span>
          <span className="typing-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </div>
        <TextField Name={username} onSendMessage={handleSendMessage} onTypingChange={handleTypingChange} />
      </div>
    </div>
  )
}

export default App;