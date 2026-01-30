import { morseToText } from './morse';

export async function decodeAudioFile(file: File, wpm: number = 20): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get audio data
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        
        // Detect tone presence (simple envelope detection)
        const windowSize = Math.floor(sampleRate * 0.01); // 10ms windows
        const threshold = 0.05;
        
        const tones: { start: number; end: number }[] = [];
        let inTone = false;
        let toneStart = 0;
        
        for (let i = 0; i < channelData.length; i += windowSize) {
          // Calculate RMS for this window
          let sum = 0;
          for (let j = i; j < Math.min(i + windowSize, channelData.length); j++) {
            sum += channelData[j] * channelData[j];
          }
          const rms = Math.sqrt(sum / windowSize);
          
          if (rms > threshold && !inTone) {
            // Tone started
            inTone = true;
            toneStart = i / sampleRate;
          } else if (rms <= threshold && inTone) {
            // Tone ended
            inTone = false;
            tones.push({ start: toneStart, end: i / sampleRate });
          }
        }
        
        // Convert tone durations to morse
        const ditDuration = 1.2 / wpm;
        const threshold_dit_dah = ditDuration * 2;
        
        let morse = '';
        let lastEnd = 0;
        
        for (const tone of tones) {
          const gap = tone.start - lastEnd;
          const duration = tone.end - tone.start;
          
          // Add gap symbols
          if (gap > ditDuration * 5) {
            morse += ' / '; // Word gap
          } else if (gap > ditDuration * 2) {
            morse += ' '; // Letter gap
          }
          
          // Add dit or dah
          if (duration < threshold_dit_dah) {
            morse += '.';
          } else {
            morse += '-';
          }
          
          lastEnd = tone.end;
        }
        
        // Decode morse to text
        const text = morseToText(morse.trim());
        resolve(text || '[Unable to decode]');
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
