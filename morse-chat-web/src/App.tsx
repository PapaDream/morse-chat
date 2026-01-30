import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";

export interface Message {
  id: string;
  message: string;
  morse: string;
  timestamp: Date;
  isOwn: boolean;
}

function App() {
  // Sidebar state
  const [wpm, setWpm] = useState(20);
  const [inputDevice, setInputDevice] = useState("default");
  const [outputDevice, setOutputDevice] = useState("default");
  const [autoScroll, setAutoScroll] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [callSign, setCallSign] = useState("K1ABC");

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      message: "CQ CQ CQ DE K1ABC",
      morse: "-.-. --.- / -.-. --.- / -.-. --.- / -.. . / -.- .---- .- -... -.-.",
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
    },
    {
      id: "2",
      message: "K1ABC DE W2XYZ GM",
      morse: "-.- .---- .- -... -.-. / -.. . / .-- ..--- -..- -.-- --.. / --. --",
      timestamp: new Date(Date.now() - 240000),
      isOwn: true,
    },
    {
      id: "3",
      message: "UR RST 599 599",
      morse: "..- .-. / .-. ... - / ..... ----. ----. / ..... ----. ----.",
      timestamp: new Date(Date.now() - 180000),
      isOwn: false,
    },
  ]);

  const handleSendMessage = (message: string, morse: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      message,
      morse,
      timestamp: new Date(),
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        wpm={wpm}
        onWpmChange={setWpm}
        inputDevice={inputDevice}
        onInputDeviceChange={setInputDevice}
        outputDevice={outputDevice}
        onOutputDeviceChange={setOutputDevice}
        autoScroll={autoScroll}
        onAutoScrollChange={setAutoScroll}
        soundEnabled={soundEnabled}
        onSoundEnabledChange={setSoundEnabled}
        callSign={callSign}
        onCallSignChange={setCallSign}
      />
      <ChatArea
        messages={messages}
        onSendMessage={handleSendMessage}
        autoScroll={autoScroll}
        soundEnabled={soundEnabled}
        wpm={wpm}
      />
    </div>
  );
}

export default App;
