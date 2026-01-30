import { useState, useEffect, useRef } from 'react';
import type { Message } from '../App';
import { textToMorse, playMorseAudio, downloadMorseAudio } from '../utils/morse';
import { decodeAudioFile } from '../utils/morseDecoder';

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
  const [isDragging, setIsDragging] = useState(false);
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
  
  const handleDownload = (message: string, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadMorseAudio(message, wpm);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(f => f.type.startsWith('audio/'));

    if (audioFile) {
      try {
        // Decode morse code from audio
        const decodedText = await decodeAudioFile(audioFile, wpm);
        const morse = textToMorse(decodedText);
        onSendMessage(decodedText, morse);
      } catch (error) {
        console.error('Error decoding audio:', error);
        onSendMessage('[Error decoding audio file]', '... --- ...');
      }
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
    <div className="flex-1 flex flex-col bg-black font-mono">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-black">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-3 flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-xl rounded-lg p-3 border relative group ${
                msg.isOwn 
                  ? 'bg-bubble-own border-orange-900' 
                  : 'bg-bubble-other border-gray-800'
              } ${soundEnabled ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => handleMessageClick(msg.message)}
              title={soundEnabled ? 'Click to hear Morse code' : ''}
            >
              <button
                onClick={(e) => handleDownload(msg.message, e)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-terminal-orange hover:text-terminal-orange-hover p-1"
                title="Download audio"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
              </button>
              <div className="text-terminal-orange text-sm mb-1 pr-6">
                {msg.message}
              </div>
              <div className="text-xs text-gray-600 mb-2 font-mono">
                {msg.morse}
              </div>
              <div className="text-xs text-gray-500 text-right">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div 
        className={`bg-black border-t border-gray-900 p-4 relative ${isDragging ? 'bg-opacity-80' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-terminal-orange bg-opacity-10 border-2 border-terminal-orange border-dashed flex items-center justify-center z-10">
            <span className="text-terminal-orange font-bold">Drop audio file to decode morse code</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 text-terminal-orange border border-gray-800 rounded px-4 py-3 text-sm placeholder-gray-700 focus:outline-none focus:border-terminal-orange font-mono"
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
