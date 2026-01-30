#!/usr/bin/env python3
"""
Morse Chat - Desktop application for CW transcription and transmission.
"""

import sys
import io
import wave
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QTextEdit, QLineEdit, QPushButton, QLabel, QComboBox, QSpinBox,
    QGroupBox, QCheckBox, QFrame, QTextBrowser
)
from PyQt5.QtCore import Qt, QTimer, pyqtSignal
from PyQt5.QtGui import QFont, QTextCursor, QTextCharFormat, QColor, QTextOption

from morse import text_to_morse, morse_to_text, MorseEncoder, MorseDecoder
from abbreviations import expand_abbreviations


class ToggleSwitch(QCheckBox):
    """Custom toggle switch widget."""
    
    def __init__(self, label="", parent=None):
        super().__init__(label, parent)
        self.setStyleSheet("""
            QCheckBox {
                spacing: 10px;
                font-size: 12px;
            }
            QCheckBox::indicator {
                width: 40px;
                height: 20px;
            }
            QCheckBox::indicator:unchecked {
                background-color: #ccc;
                border-radius: 10px;
            }
            QCheckBox::indicator:checked {
                background-color: #4CAF50;
                border-radius: 10px;
            }
        """)


class ChatDisplay(QTextBrowser):
    """Custom text display with hover effects and clickable messages."""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.parent_window = parent
        self.setMouseTracking(True)
        self.last_highlighted = None
    
    def mouseMoveEvent(self, event):
        """Highlight message on hover."""
        # Get the anchor (link) under the cursor
        anchor = self.anchorAt(event.pos())
        
        if anchor and anchor != self.last_highlighted:
            # New anchor - change cursor
            self.viewport().setCursor(Qt.PointingHandCursor)
            self.last_highlighted = anchor
        elif not anchor and self.last_highlighted:
            # Left anchor area
            self.viewport().setCursor(Qt.ArrowCursor)
            self.last_highlighted = None
        
        super().mouseMoveEvent(event)
    
    def mouseReleaseEvent(self, event):
        """Play audio when message is clicked."""
        anchor = self.anchorAt(event.pos())
        if anchor and self.parent_window:
            self.parent_window.play_message_audio_by_id(anchor)
        super().mouseReleaseEvent(event)


class MorseChatWindow(QMainWindow):
    """Main application window."""
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Morse Chat")
        self.setMinimumSize(800, 600)  # Minimum size
        self.resize(1000, 700)  # Default size, but resizable
        
        # Morse encoder/decoder
        self.wpm = 20
        self.encoder = MorseEncoder(wpm=self.wpm)
        self.decoder = MorseDecoder(wpm=self.wpm)
        
        # Settings
        self.abbreviate = False  # Default OFF
        self.audio_playback = False  # Default OFF
        
        # Store audio for playback
        self.message_audio = {}  # message_id -> audio bytes
        self.next_message_id = 0
        
        self.init_ui()
    
    def init_ui(self):
        """Initialize the user interface."""
        central_widget = QWidget()
        central_widget.setStyleSheet("background-color: #2a2a2a;")
        self.setCentralWidget(central_widget)
        
        main_layout = QHBoxLayout()
        central_widget.setLayout(main_layout)
        
        # Left sidebar - Settings panel
        sidebar = self.create_sidebar()
        main_layout.addWidget(sidebar)
        
        # Right side - Chat area
        chat_area = self.create_chat_area()
        main_layout.addWidget(chat_area, stretch=1)
        
        # Status bar
        self.statusBar().setStyleSheet("""
            QStatusBar {
                background-color: #1a1a1a;
                color: #ff8800;
                border-top: 2px solid #000;
                font-family: 'Courier New';
                font-size: 13pt;
            }
        """)
        self.statusBar().showMessage("Ready")
    
    def create_sidebar(self):
        """Create the settings sidebar."""
        sidebar = QFrame()
        sidebar.setFrameShape(QFrame.StyledPanel)
        sidebar.setFixedWidth(250)
        sidebar.setStyleSheet("""
            QFrame {
                background-color: #1a1a1a;
                border-right: 2px solid #000;
            }
        """)
        
        layout = QVBoxLayout()
        sidebar.setLayout(layout)
        
        # Title
        title = QLabel("Settings")
        title.setFont(QFont("Courier New", 18, QFont.Bold))
        title.setStyleSheet("color: #ff8800; padding: 8px;")
        layout.addWidget(title)
        
        # WPM control
        wpm_group = QGroupBox("Speed")
        wpm_group.setStyleSheet("""
            QGroupBox {
                color: #ff8800;
                font-family: 'Courier New';
                font-weight: bold;
                border: 1px solid #000;
                border-radius: 3px;
                margin-top: 10px;
                padding-top: 10px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 5px;
            }
        """)
        wpm_layout = QVBoxLayout()
        
        wpm_label = QLabel("WPM:")
        wpm_label.setStyleSheet("color: #ff8800; font-family: 'Courier New'; font-size: 14pt;")
        self.wpm_spin = QSpinBox()
        self.wpm_spin.setRange(5, 40)
        self.wpm_spin.setValue(20)
        self.wpm_spin.valueChanged.connect(self.update_wpm)
        self.wpm_spin.setStyleSheet("""
            QSpinBox {
                background-color: #2a2a2a;
                color: #ff8800;
                border: 1px solid #000;
                border-radius: 3px;
                padding: 8px;
                font-size: 14pt;
                font-family: 'Courier New';
            }
            QSpinBox::up-button, QSpinBox::down-button {
                background-color: #1a1a1a;
                border: 1px solid #000;
            }
        """)
        
        wpm_layout.addWidget(wpm_label)
        wpm_layout.addWidget(self.wpm_spin)
        wpm_layout.addSpacing(10)
        wpm_group.setLayout(wpm_layout)
        layout.addWidget(wpm_group)
        layout.addSpacing(15)
        
        # Audio devices
        audio_group = QGroupBox("Audio")
        audio_group.setStyleSheet("""
            QGroupBox {
                color: #ff8800;
                font-family: 'Courier New';
                font-weight: bold;
                border: 1px solid #000;
                border-radius: 3px;
                margin-top: 10px;
                padding-top: 10px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 5px;
            }
        """)
        audio_layout = QVBoxLayout()
        
        input_label = QLabel("Input:")
        input_label.setStyleSheet("color: #ff8800; font-family: 'Courier New'; font-size: 14pt;")
        self.input_combo = QComboBox()
        self.input_combo.addItem("Default Microphone")
        self.input_combo.setStyleSheet("""
            QComboBox {
                background-color: #2a2a2a;
                color: #ff8800;
                border: 1px solid #000;
                border-radius: 3px;
                padding: 8px;
                font-family: 'Courier New';
                font-size: 13pt;
            }
            QComboBox::drop-down {
                border: 1px solid #000;
            }
            QComboBox QAbstractItemView {
                background-color: #2a2a2a;
                color: #ff8800;
                selection-background-color: #ff8800;
                selection-color: #000;
                font-size: 13pt;
            }
        """)
        
        output_label = QLabel("Output:")
        output_label.setStyleSheet("color: #ff8800; font-family: 'Courier New'; font-size: 14pt;")
        self.output_combo = QComboBox()
        self.output_combo.addItem("Default Speaker")
        self.output_combo.setStyleSheet("""
            QComboBox {
                background-color: #2a2a2a;
                color: #ff8800;
                border: 1px solid #000;
                border-radius: 3px;
                padding: 8px;
                font-family: 'Courier New';
                font-size: 13pt;
            }
            QComboBox::drop-down {
                border: 1px solid #000;
            }
            QComboBox QAbstractItemView {
                background-color: #2a2a2a;
                color: #ff8800;
                selection-background-color: #ff8800;
                selection-color: #000;
                font-size: 13pt;
            }
        """)
        
        audio_layout.addWidget(input_label)
        audio_layout.addWidget(self.input_combo)
        audio_layout.addWidget(output_label)
        audio_layout.addWidget(self.output_combo)
        audio_layout.addSpacing(10)
        audio_group.setLayout(audio_layout)
        layout.addWidget(audio_group)
        layout.addSpacing(15)
        
        # Options
        options_group = QGroupBox("Options")
        options_group.setStyleSheet("""
            QGroupBox {
                color: #ff8800;
                font-family: 'Courier New';
                font-weight: bold;
                border: 1px solid #000;
                border-radius: 3px;
                margin-top: 10px;
                padding-top: 10px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 5px;
            }
        """)
        options_layout = QVBoxLayout()
        
        # Abbreviate toggle
        self.abbrev_toggle = ToggleSwitch("Abbreviate")
        self.abbrev_toggle.setStyleSheet("""
            QCheckBox {
                color: #ff8800;
                font-family: 'Courier New';
                font-size: 13pt;
                spacing: 10px;
            }
            QCheckBox::indicator {
                width: 50px;
                height: 26px;
            }
            QCheckBox::indicator:unchecked {
                background-color: #2a2a2a;
                border: 1px solid #000;
                border-radius: 5px;
            }
            QCheckBox::indicator:checked {
                background-color: #ff8800;
                border: 1px solid #000;
                border-radius: 5px;
            }
        """)
        self.abbrev_toggle.setChecked(False)
        self.abbrev_toggle.stateChanged.connect(self.toggle_abbreviate)
        options_layout.addWidget(self.abbrev_toggle)
        options_layout.addSpacing(10)
        
        # Audio playback toggle
        self.audio_toggle = ToggleSwitch("Audio Playback")
        self.audio_toggle.setStyleSheet("""
            QCheckBox {
                color: #ff8800;
                font-family: 'Courier New';
                font-size: 13pt;
                spacing: 10px;
            }
            QCheckBox::indicator {
                width: 50px;
                height: 26px;
            }
            QCheckBox::indicator:unchecked {
                background-color: #2a2a2a;
                border: 1px solid #000;
                border-radius: 5px;
            }
            QCheckBox::indicator:checked {
                background-color: #ff8800;
                border: 1px solid #000;
                border-radius: 5px;
            }
        """)
        self.audio_toggle.setChecked(False)
        self.audio_toggle.stateChanged.connect(self.toggle_audio)
        options_layout.addWidget(self.audio_toggle)
        
        options_group.setLayout(options_layout)
        layout.addWidget(options_group)
        
        layout.addStretch()
        
        return sidebar
    
    def create_chat_area(self):
        """Create the main chat area."""
        chat_widget = QWidget()
        layout = QVBoxLayout()
        chat_widget.setLayout(layout)
        
        # Chat display
        self.chat_display = ChatDisplay(self)
        self.chat_display.setReadOnly(True)
        self.chat_display.setFont(QFont("Courier New", 14))
        self.chat_display.setOpenLinks(False)
        self.chat_display.setStyleSheet("""
            QTextBrowser {
                background-color: #3a3a3a;
                color: #ff8800;
                border: 2px solid #000;
                border-radius: 3px;
                padding: 15px;
                font-family: 'Courier New';
                font-size: 14pt;
            }
            QTextBrowser a {
                color: #ff8800;
                text-decoration: underline;
            }
            QTextBrowser a:hover {
                color: #ffaa00;
                background-color: #4a4a4a;
            }
        """)
        layout.addWidget(self.chat_display)
        
        # Input area
        input_container = QWidget()
        input_layout = QVBoxLayout()
        input_container.setLayout(input_layout)
        input_container.setStyleSheet("""
            QWidget {
                background-color: #2a2a2a;
                border: 2px solid #000;
                border-top: 2px solid #000;
                border-bottom-left-radius: 3px;
                border-bottom-right-radius: 3px;
                padding: 8px;
            }
        """)
        
        # Text input
        text_input_layout = QHBoxLayout()
        self.text_input = QLineEdit()
        self.text_input.setPlaceholderText("Type your message here...")
        self.text_input.returnPressed.connect(self.send_message)
        self.text_input.setStyleSheet("""
            QLineEdit {
                background-color: #1a1a1a;
                color: #ff8800;
                border: 2px solid #000;
                border-radius: 3px;
                padding: 15px;
                font-size: 18px;
                font-family: 'Courier New';
                font-weight: bold;
            }
            QLineEdit::placeholder {
                color: #665533;
            }
        """)
        
        send_button = QPushButton("Send")
        send_button.clicked.connect(self.send_message)
        send_button.setStyleSheet("""
            QPushButton {
                background-color: #ff8800;
                color: #000;
                padding: 18px 35px;
                font-size: 20px;
                font-weight: bold;
                font-family: 'Courier New';
                border: 2px solid #000;
                border-radius: 3px;
            }
            QPushButton:hover {
                background-color: #ff9920;
            }
            QPushButton:pressed {
                background-color: #dd7700;
            }
        """)
        send_button.setMinimumWidth(120)
        
        text_input_layout.addWidget(self.text_input)
        text_input_layout.addWidget(send_button)
        
        # Morse preview
        self.morse_preview = QLabel("")
        self.morse_preview.setFont(QFont("Courier New", 12))
        self.morse_preview.setWordWrap(True)
        self.morse_preview.setStyleSheet("color: #ff8800; padding: 5px; font-family: 'Courier New'; font-size: 12pt;")
        self.text_input.textChanged.connect(self.update_morse_preview)
        
        input_layout.addLayout(text_input_layout)
        input_layout.addWidget(self.morse_preview)
        
        layout.addWidget(input_container)
        
        return chat_widget
    
    def update_wpm(self, wpm):
        """Update WPM setting."""
        self.wpm = wpm
        self.encoder = MorseEncoder(wpm=wpm)
        self.decoder = MorseDecoder(wpm=wpm)
        self.statusBar().showMessage(f"WPM set to {wpm}")
    
    def toggle_abbreviate(self, state):
        """Toggle abbreviation expansion."""
        self.abbreviate = bool(state)
    
    def toggle_audio(self, state):
        """Toggle audio playback."""
        self.audio_playback = bool(state)
        if state:
            self.statusBar().showMessage("Audio playback enabled - click messages to hear CW")
        else:
            self.statusBar().showMessage("Audio playback disabled")
    
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
        
        message_id = self.next_message_id
        self.next_message_id += 1
        
        # Generate audio if playback enabled
        if self.audio_playback:
            audio_bytes = self.encoder.generate_audio(text)
            self.message_audio[message_id] = audio_bytes
        
        # Display in chat - Discord style
        self.append_message("You", text, message_id, "#2196F3")
        
        # Show expanded abbreviations if enabled
        if self.abbreviate:
            expanded = expand_abbreviations(text, show_original=True)
            if expanded.upper() != text.upper():
                self.append_text(f"    └─ {expanded}", "#0066cc")
        
        # Show Morse code
        morse = text_to_morse(text)
        self.append_text(f"    └─ {morse}", "#999")
        
        # Status message
        self.statusBar().showMessage(f"Sent: {text}")
        
        # Clear input
        self.text_input.clear()
    
    def append_message(self, sender, text, message_id=None, color="#000"):
        """Append a message to the chat display."""
        cursor = self.chat_display.textCursor()
        cursor.movePosition(QTextCursor.End)
        
        # Format timestamp
        from datetime import datetime
        timestamp = datetime.now().strftime("%H:%M")
        
        # Create clickable message if audio is available
        if message_id is not None and self.audio_playback:
            html = f'<div style="margin: 5px 0; font-family: Courier New; word-wrap: break-word;">'
            html += f'<span style="color: #996633; font-size: 11pt;">{timestamp}</span> '
            html += f'<b style="color: #ff8800; font-size: 14pt;">{sender}:</b> '
            html += f'<a href="#{message_id}" title="Click to hear Morse code" style="color: #ff8800; font-size: 14pt;">{text}</a>'
            html += '</div>'
        else:
            html = f'<div style="margin: 5px 0; font-family: Courier New; word-wrap: break-word;">'
            html += f'<span style="color: #996633; font-size: 11pt;">{timestamp}</span> '
            html += f'<b style="color: #ff8800; font-size: 14pt;">{sender}:</b> '
            html += f'<span style="color: #ff8800; font-size: 14pt;">{text}</span>'
            html += '</div>'
        
        cursor.insertHtml(html)
        
        # Auto-scroll to bottom
        self.chat_display.setTextCursor(cursor)
        self.chat_display.ensureCursorVisible()
    
    def append_text(self, text, color="#ff8800"):
        """Append plain text (for Morse/abbreviations)."""
        cursor = self.chat_display.textCursor()
        cursor.movePosition(QTextCursor.End)
        
        # Dimmer orange for secondary text
        html = f'<div style="margin: 2px 0; color: #cc6600; font-size: 12pt; font-family: Courier New; word-wrap: break-word;">{text}</div>'
        cursor.insertHtml(html)
        
        # Auto-scroll to bottom
        self.chat_display.setTextCursor(cursor)
        self.chat_display.ensureCursorVisible()
    
    def play_message_audio_by_id(self, anchor):
        """Play audio for a message when clicked."""
        if not self.audio_playback:
            self.statusBar().showMessage("Enable 'Audio Playback' to hear Morse code")
            return
        
        # Extract message ID from anchor
        try:
            message_id = int(anchor.replace('#', ''))
            if message_id in self.message_audio:
                # TODO: Actually play the audio with PyAudio
                # For now, just show a message
                self.statusBar().showMessage(f"🔊 Playing Morse code audio...")
                # Would use PyAudio here to play self.message_audio[message_id]
            else:
                self.statusBar().showMessage("No audio available for this message")
        except ValueError:
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
