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
