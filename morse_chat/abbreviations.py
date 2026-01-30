"""
Ham radio CW abbreviations and Q-codes translator.
Expands shorthand into contextual English.
"""

# Common CW abbreviations
CW_ABBREVIATIONS = {
    # Basic Q-codes
    'QRL': 'Are you busy?',
    'QRM': 'interference',
    'QRN': 'static',
    'QRP': 'low power',
    'QRQ': 'send faster',
    'QRS': 'send slower',
    'QRT': 'stop sending',
    'QRU': 'I have nothing for you',
    'QRV': 'I am ready',
    'QRZ': 'Who is calling me?',
    'QSB': 'signal fading',
    'QSL': 'I confirm',
    'QSO': 'contact',
    'QSY': 'change frequency',
    'QTH': 'location',
    
    # Common abbreviations
    'ABT': 'about',
    'AGN': 'again',
    'ANI': 'any',
    'ANT': 'antenna',
    'AR': '[end of message]',
    'AS': '[wait]',
    'B4': 'before',
    'BCNU': 'be seeing you',
    'BK': 'break',
    'BT': '[pause]',
    'BTW': 'by the way',
    'C': 'yes',
    'CL': '[closing]',
    'CQ': 'calling any station',
    'CUL': 'see you later',
    'CW': 'Morse code',
    'DE': 'from',
    'DX': 'distant station',
    'ES': 'and',
    'FB': 'fine business',
    'FER': 'for',
    'FM': 'from',
    'GA': 'good afternoon',
    'GE': 'good evening',
    'GM': 'good morning',
    'GN': 'good night',
    'GND': 'ground',
    'GUD': 'good',
    'HI': '[laughter]',
    'HR': 'here',
    'HW': 'how',
    'K': 'over',
    'KN': 'over, specific station only',
    'LP': 'long path',
    'MSG': 'message',
    'N': 'no',
    'NR': 'number',
    'NW': 'now',
    'OK': 'okay',
    'OM': 'old man',
    'OP': 'operator',
    'OT': 'old timer',
    'PSE': 'please',
    'R': 'received',
    'RIG': 'equipment',
    'RPT': 'repeat',
    'RST': 'readability-strength-tone',
    'SK': '[end of contact]',
    'SN': 'soon',
    'SKED': 'schedule',
    'SP': 'short path',
    'SRI': 'sorry',
    'STN': 'station',
    'TKS': 'thanks',
    'TU': 'thank you',
    'TNX': 'thanks',
    'TRX': 'transceiver',
    'TU': 'thank you',
    'TX': 'transmit',
    'U': 'you',
    'UR': 'your/you are',
    'VY': 'very',
    'WX': 'weather',
    'XMAS': 'Christmas',
    'XYL': 'wife',
    'YL': 'young lady',
    '73': 'best regards',
    '88': 'love and kisses',
    '599': 'perfect signal (RST)',
}

# RST signal report decoder
def decode_rst(rst: str) -> str:
    """
    Decode RST (Readability-Strength-Tone) signal report.
    
    Args:
        rst: Three digit code like "599"
        
    Returns:
        Human-readable description
    """
    if len(rst) != 3 or not rst.isdigit():
        return rst
    
    r, s, t = rst[0], rst[1], rst[2]
    
    readability = {
        '1': 'unreadable',
        '2': 'barely readable',
        '3': 'readable with difficulty',
        '4': 'readable with no difficulty',
        '5': 'perfectly readable',
    }
    
    strength = {
        '1': 'faint',
        '2': 'very weak',
        '3': 'weak',
        '4': 'fair',
        '5': 'fairly good',
        '6': 'good',
        '7': 'moderately strong',
        '8': 'strong',
        '9': 'extremely strong',
    }
    
    tone = {
        '1': 'very rough',
        '2': 'rough AC',
        '3': 'rough DC',
        '4': 'fair',
        '5': 'fair DC',
        '6': 'good DC',
        '7': 'near DC',
        '8': 'good DC',
        '9': 'perfect DC tone',
    }
    
    parts = []
    if r in readability:
        parts.append(f"R{r}={readability[r]}")
    if s in strength:
        parts.append(f"S{s}={strength[s]}")
    if t in tone:
        parts.append(f"T{t}={tone[t]}")
    
    if parts:
        return f"{rst} ({', '.join(parts)})"
    return rst


def expand_abbreviations(text: str, show_original: bool = True) -> str:
    """
    Expand CW abbreviations to contextual English.
    
    Args:
        text: CW text with abbreviations
        show_original: If True, show original in brackets
        
    Returns:
        Expanded text
    """
    words = text.upper().split()
    expanded = []
    
    for word in words:
        # Check for RST code
        if len(word) == 3 and word.isdigit():
            if word[0] in '12345' and word[1] in '123456789' and word[2] in '123456789':
                expanded_word = decode_rst(word)
                if show_original and expanded_word != word:
                    expanded.append(f"{word} [{expanded_word}]")
                else:
                    expanded.append(expanded_word)
                continue
        
        # Check for abbreviation
        if word in CW_ABBREVIATIONS:
            if show_original:
                expanded.append(f"{word} [{CW_ABBREVIATIONS[word]}]")
            else:
                expanded.append(CW_ABBREVIATIONS[word])
        else:
            expanded.append(word)
    
    return ' '.join(expanded)


def is_prosign(text: str) -> bool:
    """Check if text is a prosign (procedural signal)."""
    prosigns = ['AR', 'AS', 'BK', 'BT', 'CL', 'K', 'KN', 'SK']
    return text.upper() in prosigns
