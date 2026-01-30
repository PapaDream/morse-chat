# Quick Start Guide

## For Users

### Download and Run

**Option 1: Download Pre-built App** (Coming soon)
- macOS: Download `.dmg` from Releases
- Windows: Download `.exe` from Releases
- Linux: `pip install morse-chat && morse-chat`

**Option 2: Run from Source**
```bash
git clone https://github.com/PapaDream/morse-chat.git
cd morse-chat
pip install -r requirements.txt
python morse_chat/main.py
```

## For Developers

### Set Up Development Environment
```bash
# Clone the repo
git clone https://github.com/PapaDream/morse-chat.git
cd morse-chat

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the app
python morse_chat/main.py
```

### Build Standalone Executable
```bash
# macOS/Linux
./build.sh

# Windows
build.bat
```

Executable will be in `dist/` folder.

## Using the App

1. **Set WPM** - Adjust to match your sending/receiving speed (5-40 WPM)
2. **Type Message** - Enter text in the bottom box
3. **Send CW** - Click button or press Enter
4. **Monitor Input** - Audio transcription will appear in chat window

## Keyboard Shortcuts

- `Enter` - Send message
- Coming soon: more shortcuts

## Audio Setup

### For Radio Interface
1. Connect radio audio output to computer line-in/mic
2. Connect computer audio output to radio mic input
3. Select appropriate devices in Settings

### For Practice (No Radio)
- Use default mic/speaker
- Practice with another instance of the app

## Troubleshooting

**No audio devices shown**
- Make sure PyAudio is installed: `pip install pyaudio`
- On macOS, you may need: `brew install portaudio`
- On Linux: `sudo apt-get install portaudio19-dev`

**App won't start**
- Check Python version: `python --version` (need 3.8+)
- Reinstall dependencies: `pip install -r requirements.txt`

**Decoding not working**
- Adjust WPM to match incoming signal
- Check audio input level
- Verify audio input device is selected

## Next Steps

- Check [CONTRIBUTING.md](CONTRIBUTING.md) to help develop
- Report bugs in [GitHub Issues](https://github.com/PapaDream/morse-chat/issues)
- Join discussions in [GitHub Discussions](https://github.com/PapaDream/morse-chat/discussions)

73!
