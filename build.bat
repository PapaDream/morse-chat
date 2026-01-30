@echo off
REM Build script for Windows

echo Building Morse Chat...

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
pip install pyinstaller

REM Build executable
echo Building executable...
pyinstaller --name="Morse Chat" ^
    --windowed ^
    --onefile ^
    --icon=assets\icon.ico ^
    morse_chat\main.py

echo Build complete! Executable in dist\
pause
