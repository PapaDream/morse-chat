interface SidebarProps {
  wpm: number;
  onWpmChange: (wpm: number) => void;
  inputDevice: string;
  onInputDeviceChange: (device: string) => void;
  outputDevice: string;
  onOutputDeviceChange: (device: string) => void;
  autoScroll: boolean;
  onAutoScrollChange: (enabled: boolean) => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (enabled: boolean) => void;
}

export function Sidebar({
  wpm,
  onWpmChange,
  inputDevice,
  onInputDeviceChange,
  outputDevice,
  onOutputDeviceChange,
  autoScroll,
  onAutoScrollChange,
  soundEnabled,
  onSoundEnabledChange,
}: SidebarProps) {
  return (
    <div className="w-64 bg-terminal-sidebar border-r-2 border-black flex flex-col p-4">
      <h1 className="text-2xl font-bold text-terminal-orange mb-6">Settings</h1>
      
      {/* Speed Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-terminal-orange mb-3">Speed</h2>
        <input
          type="range"
          min="10"
          max="40"
          step="10"
          value={wpm}
          onChange={(e) => onWpmChange(Number(e.target.value))}
          className="w-full h-2 bg-terminal-chat rounded appearance-none cursor-pointer slider-orange"
        />
        <div className="flex justify-between text-xs text-terminal-orange mt-1 px-1">
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40</span>
        </div>
        <div className="text-center text-sm font-bold text-terminal-orange mt-2">
          {wpm} WPM
        </div>
      </div>

      {/* Audio Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-terminal-orange mb-3">Audio</h2>
        
        <label className="block text-sm text-terminal-orange mb-1">Input:</label>
        <select
          value={inputDevice}
          onChange={(e) => onInputDeviceChange(e.target.value)}
          className="w-full bg-terminal-chat text-terminal-orange border border-black rounded px-2 py-2 mb-3 text-sm"
        >
          <option value="default">Default Microphone</option>
        </select>

        <label className="block text-sm text-terminal-orange mb-1">Output:</label>
        <select
          value={outputDevice}
          onChange={(e) => onOutputDeviceChange(e.target.value)}
          className="w-full bg-terminal-chat text-terminal-orange border border-black rounded px-2 py-2 text-sm"
        >
          <option value="default">Default Speaker</option>
        </select>
      </div>

      {/* Options Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-terminal-orange mb-3">Options</h2>
        
        <label className="flex items-center justify-between mb-3 cursor-pointer">
          <span className="text-sm text-terminal-orange">Auto Scroll</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => onAutoScrollChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-terminal-chat rounded border border-black peer-checked:bg-terminal-orange transition-colors"></div>
          </div>
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-terminal-orange">Sound</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => onSoundEnabledChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-terminal-chat rounded border border-black peer-checked:bg-terminal-orange transition-colors"></div>
          </div>
        </label>
      </div>
    </div>
  );
}
