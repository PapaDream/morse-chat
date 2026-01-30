"""
Morse code encoder and decoder using ITU standard.
"""

# ITU Morse Code mapping
MORSE_CODE = {
    'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
    'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
    'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
    'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
    'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.',
    '-': '-....-', '=': '-...-', ' ': ' '
}

# Reverse mapping for decoding
CODE_TO_CHAR = {v: k for k, v in MORSE_CODE.items()}


def text_to_morse(text: str) -> str:
    """
    Convert text to Morse code.
    
    Args:
        text: Plain text string
        
    Returns:
        Morse code string with spaces between letters and / between words
    """
    text = text.upper()
    morse = []
    
    for char in text:
        if char == ' ':
            morse.append('/')
        elif char in MORSE_CODE:
            morse.append(MORSE_CODE[char])
    
    return ' '.join(morse)


def morse_to_text(morse: str) -> str:
    """
    Convert Morse code to text.
    
    Args:
        morse: Morse code string (spaces between letters, / between words)
        
    Returns:
        Decoded text string
    """
    # Split by word separator
    words = morse.split(' / ')
    decoded_words = []
    
    for word in words:
        # Split by letter separator
        letters = word.split(' ')
        decoded_letters = []
        
        for letter in letters:
            if letter in CODE_TO_CHAR:
                decoded_letters.append(CODE_TO_CHAR[letter])
            elif letter:
                decoded_letters.append('?')  # Unknown code
        
        decoded_words.append(''.join(decoded_letters))
    
    return ' '.join(decoded_words)


def get_timing(wpm: int) -> dict:
    """
    Calculate Morse code timing parameters for given WPM.
    
    Standard: PARIS method (50 dit units per word)
    
    Args:
        wpm: Words per minute (5-40 typical range)
        
    Returns:
        Dictionary with dit_ms, dah_ms, etc.
    """
    # Duration of one dit in milliseconds
    dit_ms = 1200 / wpm
    
    return {
        'dit_ms': dit_ms,
        'dah_ms': dit_ms * 3,
        'element_gap_ms': dit_ms,           # Gap between dits/dahs
        'letter_gap_ms': dit_ms * 3,        # Gap between letters
        'word_gap_ms': dit_ms * 7,          # Gap between words
    }


class MorseDecoder:
    """
    Real-time Morse code audio decoder.
    """
    
    def __init__(self, wpm: int = 20, tone_freq: int = 700):
        """
        Initialize decoder.
        
        Args:
            wpm: Expected words per minute
            tone_freq: Expected tone frequency in Hz
        """
        self.wpm = wpm
        self.tone_freq = tone_freq
        self.timing = get_timing(wpm)
        
        self.current_code = []
        self.current_word = []
        self.decoded_text = []
        
        self.tone_start = None
        self.silence_start = None
    
    def process_tone(self, duration_ms: float):
        """
        Process a detected tone (dit or dah).
        
        Args:
            duration_ms: Duration of tone in milliseconds
        """
        threshold = (self.timing['dit_ms'] + self.timing['dah_ms']) / 2
        
        if duration_ms < threshold:
            self.current_code.append('.')
        else:
            self.current_code.append('-')
    
    def process_silence(self, duration_ms: float):
        """
        Process a period of silence.
        
        Args:
            duration_ms: Duration of silence in milliseconds
        """
        # Short silence: element gap (within letter)
        if duration_ms < self.timing['letter_gap_ms']:
            return
        
        # Medium silence: letter gap
        if duration_ms < self.timing['word_gap_ms']:
            if self.current_code:
                morse_char = ''.join(self.current_code)
                if morse_char in CODE_TO_CHAR:
                    self.current_word.append(CODE_TO_CHAR[morse_char])
                else:
                    self.current_word.append('?')
                self.current_code = []
        
        # Long silence: word gap
        else:
            if self.current_code:
                morse_char = ''.join(self.current_code)
                if morse_char in CODE_TO_CHAR:
                    self.current_word.append(CODE_TO_CHAR[morse_char])
                self.current_code = []
            
            if self.current_word:
                self.decoded_text.append(''.join(self.current_word))
                self.current_word = []
    
    def get_decoded_text(self) -> str:
        """Get the currently decoded text."""
        parts = list(self.decoded_text)
        if self.current_word:
            parts.append(''.join(self.current_word))
        if self.current_code:
            # Show incomplete character
            parts.append(''.join(self.current_code))
        return ' '.join(parts)


class MorseEncoder:
    """
    Generate Morse code audio from text.
    """
    
    def __init__(self, wpm: int = 20, tone_freq: int = 700, sample_rate: int = 44100):
        """
        Initialize encoder.
        
        Args:
            wpm: Words per minute
            tone_freq: Audio tone frequency in Hz
            sample_rate: Audio sample rate
        """
        self.wpm = wpm
        self.tone_freq = tone_freq
        self.sample_rate = sample_rate
        self.timing = get_timing(wpm)
    
    def generate_audio(self, text: str) -> bytes:
        """
        Generate audio samples for the given text.
        
        Args:
            text: Text to encode as Morse code
            
        Returns:
            Audio samples as bytes
        """
        import numpy as np
        
        morse = text_to_morse(text)
        samples = []
        
        t = 0
        for element in morse:
            if element == '.':
                # Dit
                duration = self.timing['dit_ms'] / 1000
                samples.extend(self._generate_tone(duration))
                samples.extend(self._generate_silence(self.timing['element_gap_ms'] / 1000))
                
            elif element == '-':
                # Dah
                duration = self.timing['dah_ms'] / 1000
                samples.extend(self._generate_tone(duration))
                samples.extend(self._generate_silence(self.timing['element_gap_ms'] / 1000))
                
            elif element == ' ':
                # Letter gap (already have element gap, add more)
                additional = (self.timing['letter_gap_ms'] - self.timing['element_gap_ms']) / 1000
                samples.extend(self._generate_silence(additional))
                
            elif element == '/':
                # Word gap (already have letter gap, add more)
                additional = (self.timing['word_gap_ms'] - self.timing['letter_gap_ms']) / 1000
                samples.extend(self._generate_silence(additional))
        
        # Convert to bytes
        audio_array = np.array(samples, dtype=np.float32)
        return audio_array.tobytes()
    
    def _generate_tone(self, duration: float) -> list:
        """Generate tone samples."""
        import numpy as np
        
        num_samples = int(self.sample_rate * duration)
        t = np.linspace(0, duration, num_samples, False)
        tone = np.sin(2 * np.pi * self.tone_freq * t)
        
        # Apply envelope to avoid clicks
        envelope_samples = int(self.sample_rate * 0.005)  # 5ms rise/fall
        if num_samples > 2 * envelope_samples:
            envelope = np.ones(num_samples)
            envelope[:envelope_samples] = np.linspace(0, 1, envelope_samples)
            envelope[-envelope_samples:] = np.linspace(1, 0, envelope_samples)
            tone *= envelope
        
        return tone.tolist()
    
    def _generate_silence(self, duration: float) -> list:
        """Generate silence samples."""
        num_samples = int(self.sample_rate * duration)
        return [0.0] * num_samples
