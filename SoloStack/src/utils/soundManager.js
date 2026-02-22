/**
 * SoloStack Sound Manager
 * Synthesizes cozy, lo-fi OS sounds using the Web Audio API.
 * No external assets required.
 */

let audioCtx = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const createGain = (val, duration) => {
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(val, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    return gain;
};

const sounds = {
    // Soft mechanical click
    click: () => {
        const osc = audioCtx.createOscillator();
        const gain = createGain(0.1, 0.1);

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    },

    // UI Window Pop
    pop: () => {
        const osc = audioCtx.createOscillator();
        const gain = createGain(0.15, 0.2);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    },

    // Gentle Notification Chime
    chime: () => {
        [440, 660].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = createGain(0.08, 0.8);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.05);

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, audioCtx.currentTime);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(audioCtx.currentTime + i * 0.05);
            osc.stop(audioCtx.currentTime + 0.8);
        });
    },

    // OS Boot Swell
    boot: () => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(40, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 2);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(100, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 1.5);
        filter.Q.setValueAtTime(5, audioCtx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 3);
    },

    // Subtle monthly tick
    tick: () => {
        const osc = audioCtx.createOscillator();
        const gain = createGain(0.05, 0.05);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    },

    // Soft Money Clink
    money: () => {
        const osc = audioCtx.createOscillator();
        const gain = createGain(0.1, 0.3);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
};

export const playSound = (type, isMuted = false) => {
    if (isMuted) return;
    try {
        initAudio();
        if (sounds[type]) {
            sounds[type]();
        }
    } catch (e) {
        console.warn('Sound playback failed:', e);
    }
};
