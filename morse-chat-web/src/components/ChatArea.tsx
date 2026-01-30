import { useState, useEffect, useRef } from 'react';
import type { Message } from '../App';
import { textToMorse } from '../utils/morse';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string, morse: string) => void;
  autoScroll: boolean;
}

export function ChatArea({ messages, onSendMessage, autoScroll }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [morsePreview, setMorsePreview] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    if (input) {
      setMorsePreview(textToMorse(input));
    } else {
      setMorsePreview('');
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const morse = textToMorse(input.trim());
      onSendMessage(input.trim(), morse);
      setInput('');
      setMorsePreview('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-terminal-bg">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-terminal-chat">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-terminal-timestamp">
                {formatTime(msg.timestamp)}
              </span>
              <span className={`font-bold ${msg.isOwn ? 'text-terminal-orange' : 'text-terminal-orange'}`}>
                {msg.isOwn ? 'You' : 'Them'}:
              </span>
              <span className="text-terminal-orange">{msg.message}</span>
            </div>
            <div className="text-xs text-terminal-orange-dim ml-12 mt-1">
              └─ {msg.morse}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-terminal-bg border-t-2 border-black p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-terminal-sidebar text-terminal-orange border-2 border-black rounded px-4 py-3 text-lg font-bold placeholder-terminal-timestamp focus:outline-none focus:border-terminal-orange"
          />
          <button
            type="submit"
            className="bg-terminal-orange text-black font-bold text-xl px-8 py-3 rounded border-2 border-black hover:bg-terminal-orange-hover transition-colors min-w-[120px]"
          >
            SEND
          </button>
        </form>
        {morsePreview && (
          <div className="text-xs text-terminal-orange mt-2 px-2">
            Morse: {morsePreview}
          </div>
        )}
      </div>
    </div>
  );
}
