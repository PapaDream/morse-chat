// ITU Morse Code mapping
const MORSE_CODE: Record<string, string> = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
  'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
  'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
  'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.',
  '-': '-....-', '=': '-...-', ' ': '/'
};

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map(char => MORSE_CODE[char] || '')
    .filter(code => code !== '')
    .join(' ');
}

export function morseToText(morse: string): string {
  const reverseMorse = Object.fromEntries(
    Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
  );
  
  return morse
    .split(' ')
    .map(code => reverseMorse[code] || '')
    .join('');
}

export function playMorseAudio(text: string, wpm: number = 20): void {
  const audioContext = new AudioContext();
  const morse = textToMorse(text);
  
  // Timing calculations (PARIS standard)
  const ditDuration = 1.2 / wpm; // seconds
  const dahDuration = ditDuration * 3;
  const elementGap = ditDuration;
  const letterGap = ditDuration * 3;
  const wordGap = ditDuration * 7;
  
  const frequency = 700; // Hz - standard CW tone
  let currentTime = audioContext.currentTime;
  
  for (let i = 0; i < morse.length; i++) {
    const char = morse[i];
    
    if (char === '.') {
      // Dit
      playTone(audioContext, frequency, currentTime, ditDuration);
      currentTime += ditDuration + elementGap;
    } else if (char === '-') {
      // Dah
      playTone(audioContext, frequency, currentTime, dahDuration);
      currentTime += dahDuration + elementGap;
    } else if (char === ' ') {
      // Letter gap (already have element gap)
      currentTime += letterGap - elementGap;
    } else if (char === '/') {
      // Word gap (already have letter gap)
      currentTime += wordGap - letterGap;
    }
  }
}

function playTone(
  audioContext: AudioContext,
  frequency: number,
  startTime: number,
  duration: number
): void {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  // Envelope to avoid clicks
  const rampTime = 0.005; // 5ms
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + rampTime);
  gainNode.gain.setValueAtTime(0.3, startTime + duration - rampTime);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
  
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function downloadMorseAudio(text: string, wpm: number = 20): void {
  const morse = textToMorse(text);
  const sampleRate = 44100;
  const frequency = 700;
  
  // Timing calculations
  const ditDuration = 1.2 / wpm;
  const dahDuration = ditDuration * 3;
  const elementGap = ditDuration;
  const letterGap = ditDuration * 3;
  const wordGap = ditDuration * 7;
  
  // Calculate total duration
  let totalDuration = 0;
  for (let i = 0; i < morse.length; i++) {
    const char = morse[i];
    if (char === '.') totalDuration += ditDuration + elementGap;
    else if (char === '-') totalDuration += dahDuration + elementGap;
    else if (char === ' ') totalDuration += letterGap - elementGap;
    else if (char === '/') totalDuration += wordGap - letterGap;
  }
  
  const numSamples = Math.floor(totalDuration * sampleRate);
  const samples = new Float32Array(numSamples);
  
  let currentSample = 0;
  for (let i = 0; i < morse.length; i++) {
    const char = morse[i];
    let toneDuration = 0;
    
    if (char === '.') toneDuration = ditDuration;
    else if (char === '-') toneDuration = dahDuration;
    
    if (toneDuration > 0) {
      const toneSamples = Math.floor(toneDuration * sampleRate);
      const rampSamples = Math.floor(0.005 * sampleRate);
      
      for (let j = 0; j < toneSamples; j++) {
        const t = (currentSample + j) / sampleRate;
        let amplitude = 0.3;
        
        // Envelope
        if (j < rampSamples) {
          amplitude *= j / rampSamples;
        } else if (j > toneSamples - rampSamples) {
          amplitude *= (toneSamples - j) / rampSamples;
        }
        
        samples[currentSample + j] = amplitude * Math.sin(2 * Math.PI * frequency * t);
      }
      currentSample += toneSamples;
      
      // Element gap
      currentSample += Math.floor(elementGap * sampleRate);
    } else if (char === ' ') {
      currentSample += Math.floor((letterGap - elementGap) * sampleRate);
    } else if (char === '/') {
      currentSample += Math.floor((wordGap - letterGap) * sampleRate);
    }
  }
  
  // Convert to WAV
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  
  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  
  // PCM data
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample * 32767, true);
    offset += 2;
  }
  
  const blob = new Blob([buffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `morse-${text.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}.wav`;
  a.click();
  URL.revokeObjectURL(url);
}
