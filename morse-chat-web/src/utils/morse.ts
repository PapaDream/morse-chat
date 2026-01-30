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

export function generateMorseAudio(text: string, wpm: number = 20): AudioBuffer | null {
  // TODO: Implement Web Audio API morse code generation
  return null;
}
