#!/usr/bin/env python3
"""
Morse Chat - Desktop application for CW transcription and transmission.
"""

import sys
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QTextEdit, QLineEdit, QPushButton, QLabel, QComboBox, QSpinBox,
    QGroupBox
)
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QFont, QTextCursor

from morse import text_to_morse, morse_to_text, MorseEncoder, MorseDecoder


class MorseChatWindow(QMainWindow):
    """Main application window."""
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Morse Chat")
        self.setGeometry(100, 100, 800, 600)
        
        # Morse encoder/decoder
        self.wpm = 20
        self.encoder = MorseEncoder(wpm=self.wpm)
        self.decoder = MorseDecoder(wpm=self.wpm)
        
        # Audio state
        self.audio_enabled = False
        
        self.init_ui()
    
    def init_ui(self):
        """Initialize the user interface."""
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        layout = QVBoxLayout()
        central_widget.setLayout(layout)
        
        # Settings panel
        settings_group = QGroupBox("Settings")
        settings_layout = QHBoxLayout()
        
        # WPM control
        wpm_label = QLabel("WPM:")
        self.wpm_spin = QSpinBox()
        self.wpm_spin.setRange(5, 40)
        self.wpm_spin.setValue(20)
        self.wpm_spin.valueChanged.connect(self.update_wpm)
        
        # Audio device selection (placeholder)
        input_label = QLabel("Input:")
        self.input_combo = QComboBox()
        self.input_combo.addItem("Default Microphone")
        
        output_label = QLabel("Output:")
        self.output_combo = QComboBox()
        self.output_combo.addItem("Default Speaker")
        
        settings_layout.addWidget(wpm_label)
        settings_layout.addWidget(self.wpm_spin)
        settings_layout.addWidget(input_label)
        settings_layout.addWidget(self.input_combo)
        settings_layout.addWidget(output_label)
        settings_layout.addWidget(self.output_combo)
        settings_layout.addStretch()
        
        settings_group.setLayout(settings_layout)
        layout.addWidget(settings_group)
        
        # Chat display
        chat_group = QGroupBox("Conversation")
        chat_layout = QVBoxLayout()
        
        self.chat_display = QTextEdit()
        self.chat_display.setReadOnly(True)
        self.chat_display.setFont(QFont("Courier", 12))
        
        chat_layout.addWidget(self.chat_display)
        chat_group.setLayout(chat_layout)
        layout.addWidget(chat_group)
        
        # Input area
        input_group = QGroupBox("Send Message")
        input_layout = QVBoxLayout()
        
        # Text input
        text_input_layout = QHBoxLayout()
        self.text_input = QLineEdit()
        self.text_input.setPlaceholderText("Type your message here...")
        self.text_input.returnPressed.connect(self.send_message)
        
        send_button = QPushButton("Send CW")
        send_button.clicked.connect(self.send_message)
        
        text_input_layout.addWidget(self.text_input)
        text_input_layout.addWidget(send_button)
        
        # Morse preview
        self.morse_preview = QLabel("")
        self.morse_preview.setFont(QFont("Courier", 10))
        self.morse_preview.setStyleSheet("color: #666;")
        self.text_input.textChanged.connect(self.update_morse_preview)
        
        input_layout.addLayout(text_input_layout)
        input_layout.addWidget(self.morse_preview)
        
        input_group.setLayout(input_layout)
        layout.addWidget(input_group)
        
        # Status bar
        self.statusBar().showMessage("Ready")
    
    def update_wpm(self, wpm):
        """Update WPM setting."""
        self.wpm = wpm
        self.encoder = MorseEncoder(wpm=wpm)
        self.decoder = MorseDecoder(wpm=wpm)
        self.statusBar().showMessage(f"WPM set to {wpm}")
    
    def update_morse_preview(self, text):
        """Update the Morse code preview."""
        if text:
            morse = text_to_morse(text)
            self.morse_preview.setText(f"Morse: {morse}")
        else:
            self.morse_preview.setText("")
    
    def send_message(self):
        """Send the typed message as Morse code."""
        text = self.text_input.text().strip()
        if not text:
            return
        
        # Display in chat
        self.append_to_chat(f"You: {text}", "blue")
        
        # Show Morse code
        morse = text_to_morse(text)
        self.append_to_chat(f"    {morse}", "#666")
        
        # TODO: Generate and play audio
        self.statusBar().showMessage(f"Sending: {text}")
        
        # Clear input
        self.text_input.clear()
    
    def append_to_chat(self, message, color="black"):
        """Append a message to the chat display."""
        cursor = self.chat_display.textCursor()
        cursor.movePosition(QTextCursor.End)
        
        # Insert message with color
        cursor.insertHtml(f'<span style="color: {color};">{message}</span><br>')
        
        # Scroll to bottom
        self.chat_display.setTextCursor(cursor)
        self.chat_display.ensureCursorVisible()
    
    def start_audio_input(self):
        """Start listening for Morse code audio."""
        # TODO: Implement audio input processing
        self.statusBar().showMessage("Audio input not yet implemented")
    
    def stop_audio_input(self):
        """Stop listening for Morse code audio."""
        pass


def main():
    """Application entry point."""
    app = QApplication(sys.argv)
    
    # Set application style
    app.setStyle('Fusion')
    
    # Create and show main window
    window = MorseChatWindow()
    window.show()
    
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()
