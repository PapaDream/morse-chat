#!/usr/bin/env python3
"""
Simple tests for Morse Chat functionality.
"""

from morse_chat.morse import text_to_morse, morse_to_text, get_timing
from morse_chat.abbreviations import expand_abbreviations, decode_rst

def test_encoding():
    """Test text to Morse conversion."""
    tests = [
        ("HELLO", ".... . .-.. .-.. ---"),
        ("SOS", "... --- ..."),
        ("CQ", "-.-. --.-"),
        ("73", "--... ...--"),
    ]
    
    print("Testing Morse Encoding:")
    for text, expected in tests:
        result = text_to_morse(text)
        status = "✅" if result == expected else "❌"
        print(f"  {status} {text} → {result}")
        if result != expected:
            print(f"     Expected: {expected}")
    print()

def test_decoding():
    """Test Morse to text conversion."""
    tests = [
        (".... . .-.. .-.. ---", "HELLO"),
        ("... --- ...", "SOS"),
        ("-.-. --.-", "CQ"),
    ]
    
    print("Testing Morse Decoding:")
    for morse, expected in tests:
        result = morse_to_text(morse)
        status = "✅" if result == expected else "❌"
        print(f"  {status} {morse} → {result}")
        if result != expected:
            print(f"     Expected: {expected}")
    print()

def test_abbreviations():
    """Test CW abbreviation expansion."""
    tests = [
        ("TNX", "TNX [thanks]"),
        ("UR 599", "UR [your/you are] 599 [R5=perfectly readable, S9=extremely strong, T9=perfect tone]"),
        ("QTH", "QTH [location]"),
        ("73", "73 [best regards]"),
    ]
    
    print("Testing Abbreviation Expansion:")
    for text, expected in tests:
        result = expand_abbreviations(text, show_original=True)
        status = "✅" if result == expected else "❌"
        print(f"  {status} {text}")
        print(f"     → {result}")
        if result != expected:
            print(f"     Expected: {expected}")
    print()

def test_rst():
    """Test RST signal report decoding."""
    tests = [
        ("599", "599 (R5=perfectly readable, S9=extremely strong, T9=perfect tone)"),
        ("339", "339 (R3=readable with difficulty, S3=weak, T9=perfect tone)"),
    ]
    
    print("Testing RST Decoding:")
    for rst, expected in tests:
        result = decode_rst(rst)
        status = "✅" if result == expected else "❌"
        print(f"  {status} {rst} → {result}")
        if result != expected:
            print(f"     Expected: {expected}")
    print()

def test_timing():
    """Test WPM timing calculations."""
    print("Testing WPM Timing:")
    for wpm in [5, 20, 40]:
        timing = get_timing(wpm)
        print(f"  {wpm} WPM:")
        print(f"    Dit: {timing['dit_ms']:.1f}ms")
        print(f"    Dah: {timing['dah_ms']:.1f}ms")
        print(f"    Letter gap: {timing['letter_gap_ms']:.1f}ms")
    print()

def test_roundtrip():
    """Test encode → decode roundtrip."""
    tests = ["HELLO WORLD", "CQ CQ DE W1ABC K", "UR 599 TNX 73"]
    
    print("Testing Roundtrip (Text → Morse → Text):")
    for text in tests:
        morse = text_to_morse(text)
        decoded = morse_to_text(morse)
        status = "✅" if decoded == text else "❌"
        print(f"  {status} {text}")
        if decoded != text:
            print(f"     Got: {decoded}")
    print()

if __name__ == '__main__':
    print("=" * 60)
    print("Morse Chat Test Suite")
    print("=" * 60)
    print()
    
    test_encoding()
    test_decoding()
    test_abbreviations()
    test_rst()
    test_timing()
    test_roundtrip()
    
    print("=" * 60)
    print("Tests Complete!")
    print("=" * 60)
