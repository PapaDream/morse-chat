# Morse Chat

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Release](https://img.shields.io/github/v/release/PapaDream/morse-chat)](https://github.com/PapaDream/morse-chat/releases)

A desktop application for real-time Morse code (CW) audio transcription and transmission.

Perfect for ham radio operators studying for their license or communicating via CW.

## Features

### Current (v0.1.0)
- 🎧 **Audio Input**: Decode Morse code audio to text in real-time
- 📡 **Audio Output**: Type text and transmit as Morse code audio
- 💬 **Chat Interface**: Simple, clean conversation view
- ⚡ **Adjustable Speed**: Support for 5-40 WPM
- 🎨 **Visual Feedback**: See dit-dah patterns as they're decoded
- 🔊 **Configurable Audio**: Choose input/output devices

### Coming Soon
- 📻 **DMR/Digital Radio Integration**: Interface with digital mode software
- 🎙️ **Voice-to-CW**: Speak into mic, auto-convert to Morse
- 📊 **80m Band Presets**: Quick access to CW frequencies (3.500-3.600 MHz)
- 🔌 **PTT Control**: Serial/CAT control for transmitter keying
- 📝 **QSO Logging**: Track contacts and export to ADIF

See [FEATURES.md](FEATURES.md) for full roadmap.

## Download

### macOS
Download the latest `.dmg` from [Releases](https://github.com/PapaDream/morse-chat/releases)

### Windows
Download the latest `.exe` installer from [Releases](https://github.com/PapaDream/morse-chat/releases)

### Linux
```bash
pip install morse-chat
morse-chat
```

## Quick Start

1. Launch the app
2. Select your audio input device (radio interface or microphone)
3. Select your audio output device
4. Adjust WPM to match your speed
5. Start chatting!

## Development

### Prerequisites
- Python 3.8+
- PyQt5
- PyAudio

### Installation
```bash
git clone https://github.com/PapaDream/morse-chat.git
cd morse-chat
pip install -r requirements.txt
python morse_chat/main.py
```

### Building from Source
```bash
# macOS/Linux
./build.sh

# Windows
build.bat
```

## How It Works

Morse Chat uses:
- **Goertzel algorithm** for tone detection
- **Timing analysis** for dit/dah differentiation
- **Farnsworth spacing** for adjustable character/word speeds
- **Standard ITU Morse code** mapping

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

MIT License - see [LICENSE](LICENSE)

## Credits

Built for the amateur radio community. 73!

## Support

- Issues: [GitHub Issues](https://github.com/PapaDream/morse-chat/issues)
- Discussions: [GitHub Discussions](https://github.com/PapaDream/morse-chat/discussions)
