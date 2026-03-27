/**
 * Simple AudioHub — lightweight audio manager for in-game sounds.
 * - registerSound(name, url, { loop=false, volume=1 })
 * - play(name), pause(name), stop(name)
 * - playAllLooping(), stopAll()
 * - setMasterVolume(value) 0..1
 * - mute(), unmute(), toggleMute()
 *
 * Usage (example):
 *   window.audioHub.registerSound('bg', './assets/audio/bg.mp3', { loop: true, volume: 0.7 });
 *   window.audioHub.play('bg');
 */
class AudioHub {
    constructor() {
        this.sounds = new Map();
        this.masterVolume = 1;
        this.muted = false;
        this.playingMaster = false;
    }

    registerSound(name, url, options = {}) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.loop = !!options.loop;
        const baseVolume = typeof options.volume === 'number' ? options.volume : 1;
        audio.volume = this.muted ? 0 : this.masterVolume * baseVolume;
        this.sounds.set(name, { audio: audio, baseVolume: baseVolume, loop: audio.loop });
        return audio;
    }

    play(name) {
        const item = this.sounds.get(name);
        if (!item) return;
        try {
            item.audio.volume = this.muted ? 0 : this.masterVolume * item.baseVolume;
            item.audio.play();
        } catch (e) {
            // play() can fail due to autoplay policies — ignore here
        }
    }

    pause(name) {
        const item = this.sounds.get(name);
        if (!item) return;
        item.audio.pause();
    }

    stop(name) {
        const item = this.sounds.get(name);
        if (!item) return;
        item.audio.pause();
        item.audio.currentTime = 0;
    }

    playAllLooping() {
        for (const [name, s] of this.sounds) {
            if (s.loop) this.play(name);
        }
        this.playingMaster = true;
    }

    stopAll() {
        for (const [name, s] of this.sounds) {
            s.audio.pause();
            s.audio.currentTime = 0;
        }
        this.playingMaster = false;
    }

    setMasterVolume(v) {
        const vol = Math.max(0, Math.min(1, Number(v)));
        this.masterVolume = vol;
        for (const [name, s] of this.sounds) {
            s.audio.volume = this.muted ? 0 : this.masterVolume * s.baseVolume;
        }
    }

    mute() {
        this.muted = true;
        for (const [name, s] of this.sounds) {
            s.audio.volume = 0;
        }
    }

    unmute() {
        this.muted = false;
        for (const [name, s] of this.sounds) {
            s.audio.volume = this.masterVolume * s.baseVolume;
        }
    }

    toggleMute() {
        if (this.muted) this.unmute(); else this.mute();
        return this.muted;
    }

    isMuted() {
        return this.muted;
    }
}

window.audioHub = new AudioHub();

// Wire page controls (if present)
document.addEventListener('DOMContentLoaded', function () {
    const playBtn = document.getElementById('audio-play');
    const muteBtn = document.getElementById('audio-mute');
    const slider = document.getElementById('audio-slider');

    if (playBtn) {
        playBtn.addEventListener('click', function () {
            if (window.audioHub.playingMaster) {
                window.audioHub.stopAll();
                playBtn.textContent = 'Play';
            } else {
                window.audioHub.playAllLooping();
                playBtn.textContent = 'Pause';
            }
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', function () {
            const muted = window.audioHub.toggleMute();
            muteBtn.textContent = muted ? 'Unmute' : 'Mute';
        });
    }

    if (slider) {
        slider.addEventListener('input', function (e) {
            window.audioHub.setMasterVolume(e.target.value);
        });
        slider.value = window.audioHub.masterVolume;
    }
});

/**
 * Exports for runtime use:
 * - `window.audioHub.registerSound(name, url, options)` to add sounds
 * - `window.audioHub.play(name)` to play a named sound
 * - `window.audioHub.setMasterVolume(value)` to control global volume
 */
