import { useState, useEffect, useRef } from 'react';
import type { Message } from '../App';
import { textToMorse, playMorseAudio } from '../utils/morse';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string, morse: string) => void;
  autoScroll: boolean;
  soundEnabled?: boolean;
  wpm?: number;
}

export function ChatArea({ messages, onSendMessage, autoScroll, soundEnabled = true, wpm = 20 }: ChatAreaProps) {
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
      
      // Play audio if enabled
      if (soundEnabled) {
        playMorseAudio(input.trim(), wpm);
      }
      
      setInput('');
      setMorsePreview('');
    }
  };
  
  const handleMessageClick = (message: string) => {
    if (soundEnabled) {
      playMorseAudio(message, wpm);
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
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-xl rounded-lg p-3 ${
                msg.isOwn 
                  ? 'bg-orange-900 bg-opacity-50' 
                  : 'bg-gray-800 bg-opacity-50'
              } ${soundEnabled ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => handleMessageClick(msg.message)}
              title={soundEnabled ? 'Click to hear Morse code' : ''}
            >
              <div className="text-terminal-orange text-sm mb-1">
                {msg.message}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {msg.morse}
              </div>
              <div className="text-xs text-gray-600 text-right">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-terminal-orange border border-gray-700 rounded px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-terminal-orange"
          />
          <button
            type="submit"
            className="bg-terminal-orange text-black font-bold p-3 rounded hover:bg-terminal-orange-hover transition-colors"
            title="Send message"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
