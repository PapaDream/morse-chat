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
    <div className="w-64 bg-black border-r border-gray-900 flex flex-col p-4 font-mono">
      <div className="mb-6 flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-terminal-orange flex-shrink-0">
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
        </svg>
        <h1 className="text-3xl font-bold text-terminal-orange tracking-wider" style={{ textShadow: '0 0 20px rgba(255, 136, 0, 0.8)' }}>MORSE CHAT</h1>
      </div>
      
      {/* Speed Section */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-terminal-orange mb-2 uppercase tracking-wider">Speed (WPM)</h2>
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>10</span>
          <span>40</span>
        </div>
        <input
          type="range"
          min="10"
          max="40"
          step="1"
          value={wpm}
          onChange={(e) => onWpmChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded appearance-none cursor-pointer slider-orange"
        />
        <div className="text-center text-3xl font-bold text-terminal-orange mt-3" style={{ textShadow: '0 0 20px rgba(255, 136, 0, 0.8)' }}>
          {wpm}
        </div>
      </div>

      {/* Audio Section */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-terminal-orange mb-2 uppercase tracking-wider">Audio Input</h2>
        <select
          value={inputDevice}
          onChange={(e) => onInputDeviceChange(e.target.value)}
          className="w-full bg-gray-800 text-terminal-orange border border-gray-700 rounded px-3 py-2 text-sm"
        >
          <option value="default">Default Microphone</option>
        </select>
      </div>

      {/* Audio Output Section */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-terminal-orange mb-2 uppercase tracking-wider">Audio Output</h2>
        <select
          value={outputDevice}
          onChange={(e) => onOutputDeviceChange(e.target.value)}
          className="w-full bg-gray-800 text-terminal-orange border border-gray-700 rounded px-3 py-2 text-sm"
        >
          <option value="default">Default Speakers</option>
        </select>
      </div>

      {/* Options Section */}
      <div className="mb-6">
        <label className="flex items-center justify-between mb-4 cursor-pointer">
          <span className="text-sm text-terminal-orange">Auto-Scroll</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => onAutoScrollChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-800 rounded-full border border-gray-700 peer-checked:bg-terminal-orange transition-colors"></div>
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
            <div className="w-11 h-6 bg-gray-800 rounded-full border border-gray-700 peer-checked:bg-terminal-orange transition-colors"></div>
          </div>
        </label>
      </div>

      {/* Callsign at bottom */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className="text-center text-terminal-orange text-sm">
          73 DE K1ABC
        </div>
      </div>
    </div>
  );
}
