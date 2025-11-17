const audioFiles = {
  initiate: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_b2a33f3c33.mp3',
  log: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_3c3b895413.mp3',
  complete: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_8110294324.mp3',
  typing: 'https://cdn.pixabay.com/download/audio/2022/10/22/audio_518987399e.mp3',
  reset: 'https://cdn.pixabay.com/download/audio/2022/03/07/audio_29a72b07a5.mp3',
};

type SoundName = keyof typeof audioFiles;

const sounds: { [key in SoundName]?: HTMLAudioElement } = {};

let isMuted = false;
let audioInitialized = false;

// This must be called from a user interaction event to comply with browser autoplay policies.
export function initializeAudio() {
    if (audioInitialized) return;

    Object.keys(audioFiles).forEach(key => {
        const soundName = key as SoundName;
        const audio = new Audio(audioFiles[soundName]);
        audio.preload = 'auto';
        sounds[soundName] = audio;
    });
    
    // Set custom volumes for balance
    if (sounds.log) sounds.log.volume = 0.3;
    if (sounds.typing) sounds.typing.volume = 0.4;
    if (sounds.initiate) sounds.initiate.volume = 0.7;
    if (sounds.complete) sounds.complete.volume = 0.6;
    if (sounds.reset) sounds.reset.volume = 0.5;

    audioInitialized = true;
}

export const playSound = (soundName: SoundName) => {
    if (!audioInitialized || isMuted) return;

    const sound = sounds[soundName];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.warn(`Sound playback for "${soundName}" failed:`, error.message);
        });
    }
};

export const setMutedState = (muted: boolean) => {
    isMuted = muted;
    if (muted && audioInitialized) {
        Object.values(sounds).forEach(sound => {
            if (sound) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
    }
};
