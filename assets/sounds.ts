// A simple sound player using the Web Audio API to avoid needing audio files.

// Create audio context only once
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playMineSound = () => {
    if (!audioContext || audioContext.state === 'suspended') {
        audioContext?.resume();
    }
    
    if (!audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // Oscillator settings for a "clink" sound
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.05);
        
        // Gain settings to create a short sound
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        // Connect nodes and play
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.error("Error playing sound:", error);
    }
};
