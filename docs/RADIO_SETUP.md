# Radio Interface Setup

Guide for connecting Morse Chat to your radio equipment.

## Audio Interface Options

### 1. USB Sound Card Interface
**Recommended for beginners**

Popular models:
- SignaLink USB
- Tigertronics TigerTail
- RIGblaster
- DIY USB sound card interface

Connections:
- Radio headphone/speaker out → USB interface INPUT
- USB interface OUTPUT → Radio microphone input
- USB interface to computer USB port

### 2. Built-in Sound Card
**Works but may have issues**

Connections:
- Radio audio out → Computer line-in/mic
- Computer headphone out → Radio mic input

⚠️ **Warning**: Ground loops common with this setup. Consider using audio isolation transformers.

### 3. DMR/Digital Radio Setup
For digital radios (DMR, D-STAR, Fusion):

**Option A: Direct Digital Mode Interface**
- Many modern radios have USB audio interface built-in
- Appears as audio device to computer
- Enables digital modes + CW via same connection

**Option B: MMDVM Hotspot**
- Use hotspot's audio interface
- Allows computer control of digital modes
- Can simultaneously run CW through Morse Chat

## PTT (Push-to-Talk) Control

### VOX (Voice Operated Transmit)
**Simplest option**
- Enable VOX on your radio
- Morse Chat generates audio tone
- VOX detects tone and keys transmitter
- Adjust VOX sensitivity and delay

Settings:
- VOX Gain: Start at 50%, adjust up if not keying
- VOX Delay: 200-500ms (prevent choppy transmit)
- Anti-VOX: Off or low

### Serial PTT
**More reliable for CW**

Hardware needed:
- USB-to-serial adapter
- Simple PTT circuit (transistor + diode)
- Cable to radio ACC port

Common serial ports:
- RTS (pin 7) or DTR (pin 4) for keying
- Ground (pin 5)

Software control:
```python
# Example PTT control
import serial
ptt = serial.Serial('/dev/ttyUSB0', 9600)
ptt.setRTS(True)   # Key transmitter
time.sleep(0.5)
ptt.setRTS(False)  # Unkey transmitter
```

### CAT Control PTT
**For advanced setups**

If your radio supports CAT (Computer Aided Transceiver):
- Hamlib library for radio control
- Can set frequency, mode, and PTT
- Requires radio-specific CAT cable

## 80m Band CW Operation

### Frequency Allocation (Region 2 / US)
- **80m CW Band**: 3.500 - 3.600 MHz
- **DX Window**: 3.500 - 3.510 MHz
- **General**: 3.510 - 3.560 MHz
- **Novice/Tech**: 3.525 - 3.600 MHz

### Common CW Frequencies
- **3.530 MHz**: QRP (low power) calling
- **3.550 MHz**: General CW activity
- **3.560 MHz**: Upper band edge

### Preset Configuration
In Morse Chat settings (coming in v0.3.0):
```
80m Presets:
- QRP: 3.530 MHz
- DX: 3.505 MHz  
- General: 3.550 MHz
- Tech: 3.575 MHz
```

## Audio Levels

### Transmit Audio
**Goal**: Clean tone without distortion

Settings:
- Start with computer volume at 50%
- Adjust radio mic gain for ALC deflection (~30%)
- If distorted, reduce computer volume
- If under-modulated, increase computer volume

Test procedure:
1. Set radio to CW mode
2. Send test message "VVV TEST TEST"
3. Monitor on second receiver or WebSDR
4. Adjust for clean, readable signal

### Receive Audio
**Goal**: Strong signal without clipping

Settings:
- Radio volume to comfortable listening level
- Computer recording level ~50-70%
- Should see visual indication of signal in Morse Chat
- No red "clipping" indicators

## Voice-to-CW Setup (Future)

**Requirements**:
- Microphone (USB or analog)
- Speech recognition engine
- Low-latency audio path

**Process**:
1. Speak into microphone
2. Speech-to-text conversion
3. Text sanitization (remove filler words)
4. Morse code generation
5. Audio output to radio

**Use cases**:
- Accessibility for operators with physical limitations
- Practice while driving (receive only!)
- Quick ragchew without keyboard

## Troubleshooting

### No audio output to radio
- Check computer audio device selection
- Verify radio is in CW mode
- Check cable connections
- Test with music/test tone first

### No audio input from radio
- Select correct input device in Morse Chat
- Check radio volume
- Verify cable connections
- Test with voice recording app first

### PTT not working
- Test PTT circuit with multimeter
- Verify serial port settings
- Check radio ACC pinout (varies by model)
- Try different RTS/DTR settings

### Audio distortion
- Reduce computer output volume
- Check radio ALC meter
- Disable audio processing (compression, etc.)
- Use audio isolation transformers

### Ground loops / hum
- Use USB isolator
- Try different ground paths
- Use balanced audio transformers
- Separate power supplies

## Recommended Reading

- [ARRL Handbook](http://www.arrl.org/shop/ARRL-Handbook/) - Chapter on Digital Modes
- [SignaLink Manual](https://www.tigertronics.com/) - Audio interfacing guide
- [Hamlib Documentation](https://hamlib.github.io/) - CAT control reference

## Support

Questions? Ask in [GitHub Discussions](https://github.com/PapaDream/morse-chat/discussions)

73!
