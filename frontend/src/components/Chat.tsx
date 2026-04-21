import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const PERSONAS = [
  { id: 'first-time', label: 'First-time Voter' },
  { id: 'student', label: 'Student' },
  { id: 'rural', label: 'Rural Citizen' },
  { id: 'elderly', label: 'Elderly Citizen' },
  { id: 'general', label: 'General' },
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! I am your Election Process Assistant. How can I help you today?',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Point this to your backend API
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, persona }),
      });

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: data.reply || 'Sorry, I encountered an error.', sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: 'Sorry, unable to connect to the server.', sender: 'bot' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel chat-container">
      <div className="persona-selector">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', alignSelf: 'center', marginRight: '0.5rem' }}>
          I am a:
        </span>
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            className={`persona-btn ${persona === p.id ? 'active' : ''}`}
            onClick={() => setPersona(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.sender === 'bot' ? (
              <div className="markdown-body">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isLoading && <div className="message bot">Thinking...</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about voter ID, polling booths, etc..."
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}
