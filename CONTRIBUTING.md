# Contributing to Morse Chat

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/morse-chat.git
   cd morse-chat
   ```

2. **Create a virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the app**
   ```bash
   python morse_chat/main.py
   ```

## Making Changes

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes thoroughly

4. Commit with a descriptive message
   ```bash
   git commit -m "Add feature: description"
   ```

5. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request

## Code Style

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Comment complex logic

## Testing

- Test on your platform (macOS, Windows, or Linux)
- Test with different WPM settings (5-40)
- Verify audio input/output works correctly

## Feature Ideas

- [ ] Real-time audio tone detection (Goertzel algorithm)
- [ ] Support for prosigns (AR, SK, BT, etc.)
- [ ] Recording and playback of CW sessions
- [ ] Practice mode with random code generation
- [ ] Integration with SDR receivers
- [ ] QSO logging
- [ ] Adjustable tone frequency
- [ ] Visual waveform display
- [ ] Farnsworth timing support

## Bug Reports

When reporting bugs, please include:
- Operating system and version
- Python version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Questions?

Open a [GitHub Discussion](https://github.com/YOUR_USERNAME/morse-chat/discussions)

73!
