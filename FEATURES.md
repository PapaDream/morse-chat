# Feature Roadmap

## Version 0.1.0 (Current)
- [x] Basic text to Morse conversion
- [x] Morse to text conversion
- [x] Chat interface
- [x] Adjustable WPM (5-40)
- [x] Audio tone generation
- [x] Cross-platform support

## Version 0.2.0 (Next)
- [ ] **Real-time audio input processing**
  - Goertzel algorithm for tone detection
  - Automatic dit/dah timing analysis
  - Background audio monitoring
- [ ] **Audio device selection**
  - List available input/output devices
  - Support for USB audio interfaces
  - Audio level meters
- [ ] **Visual feedback**
  - Real-time dit-dah display during receive
  - Waveform visualization
  - Signal strength indicator

## Version 0.3.0 (Radio Integration)
- [ ] **DMR/Digital Radio Interface**
  - VOX (voice-operated switch) trigger for PTT
  - CAT control integration
  - Audio routing to/from digital modes software
- [ ] **80m Band Optimization**
  - Preset frequencies for 80m CW (3.500-3.600 MHz)
  - Band plan reference
  - Quick frequency selection
- [ ] **PTT Control**
  - Serial port PTT (RTS/DTR)
  - VOX activation
  - CAT control PTT
  - Configurable PTT delay

## Version 0.4.0 (Advanced Features)
- [ ] **Voice-to-Text-to-Morse**
  - Speech recognition via microphone
  - Real-time transcription to text
  - Automatic conversion to CW
  - Push-to-talk for voice input
- [ ] **QSO Logging**
  - Log contacts with callsign, time, frequency
  - Export to ADIF format
  - Integration with QRZ.com
- [ ] **Practice Mode**
  - Random code generation
  - Character/word speed training
  - Koch method support
  - Progress tracking

## Version 0.5.0 (Pro Features)
- [ ] **SDR Integration**
  - Direct SDR receiver support
  - Waterfall display
  - Multi-signal decoding
  - Recording and playback
- [ ] **Prosigns**
  - AR (end of message)
  - SK (end of contact)
  - BT (pause/break)
  - Custom prosigns
- [ ] **Macros**
  - Save common phrases
  - CQ templates
  - QSO templates
  - Contest exchanges

## Community Requests
Add your feature requests in [GitHub Issues](https://github.com/PapaDream/morse-chat/issues)!

## Technical Debt
- [ ] Unit tests for morse.py
- [ ] Audio buffer optimization
- [ ] Error handling improvements
- [ ] Configuration file support
- [ ] Logging system

## Platform-Specific
### Windows
- [ ] Windows installer (.msi)
- [ ] Audio driver detection
- [ ] COM port enumeration for PTT

### macOS
- [ ] .dmg with app bundle
- [ ] Code signing
- [ ] Accessibility permissions for audio
- [ ] Metal acceleration for waveforms

### Linux
- [ ] .deb package
- [ ] .rpm package
- [ ] AppImage
- [ ] ALSA/PulseAudio configuration helpers
