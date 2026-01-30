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
        const windowSize = Math.floor(sampleRate * 0.005); // 5ms windows
        const threshold = 0.01; // Lower threshold
        
        const tones: { start: number; end: number }[] = [];
        let inTone = false;
        let toneStart = 0;
        
        for (let i = 0; i < channelData.length; i += windowSize) {
          // Calculate RMS for this window
          let sum = 0;
          const end = Math.min(i + windowSize, channelData.length);
          for (let j = i; j < end; j++) {
            sum += Math.abs(channelData[j]);
          }
          const avg = sum / (end - i);
          
          if (avg > threshold && !inTone) {
            // Tone started
            inTone = true;
            toneStart = i / sampleRate;
          } else if (avg <= threshold && inTone) {
            // Tone ended
            inTone = false;
            const duration = (i / sampleRate) - toneStart;
            if (duration > 0.01) { // At least 10ms
              tones.push({ start: toneStart, end: i / sampleRate });
            }
          }
        }
        
        console.log('Detected tones:', tones.length);
        
        if (tones.length === 0) {
          resolve('[No morse tones detected]');
          return;
        }
        
        // Convert tone durations to morse
        const ditDuration = 1.2 / wpm;
        const threshold_dit_dah = ditDuration * 2;
        
        let morseSymbols: string[] = [];
        let currentLetter = '';
        let lastEnd = tones[0].start;
        
        for (let i = 0; i < tones.length; i++) {
          const tone = tones[i];
          const gap = tone.start - lastEnd;
          const duration = tone.end - tone.start;
          
          // Check for letter or word gap
          if (gap > ditDuration * 5 && currentLetter) {
            // Word gap
            morseSymbols.push(currentLetter);
            morseSymbols.push('/');
            currentLetter = '';
          } else if (gap > ditDuration * 2 && currentLetter) {
            // Letter gap
            morseSymbols.push(currentLetter);
            currentLetter = '';
          }
          
          // Add dit or dah
          if (duration < threshold_dit_dah) {
            currentLetter += '.';
          } else {
            currentLetter += '-';
          }
          
          lastEnd = tone.end;
        }
        
        // Add last letter
        if (currentLetter) {
          morseSymbols.push(currentLetter);
        }
        
        const morse = morseSymbols.join(' ');
        console.log('Decoded morse:', morse);
        
        // Decode morse to text
        const text = morseToText(morse);
        console.log('Decoded text:', text);
        resolve(text || '[Unable to decode - check console]');
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
