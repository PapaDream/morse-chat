"""
Setup script for Morse Chat.
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="morse-chat",
    version="0.1.0",
    author="Derek Wride",
    author_email="derek@moontax.com",
    description="Desktop application for Morse code (CW) transcription and transmission",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/PapaDream/morse-chat",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: End Users/Desktop",
        "Topic :: Communications :: Ham Radio",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        "PyQt5>=5.15.0",
        "numpy>=1.20.0",
        "pyaudio>=0.2.11",
    ],
    entry_points={
        "console_scripts": [
            "morse-chat=morse_chat.main:main",
        ],
    },
)
