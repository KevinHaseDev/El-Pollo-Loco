/**
 * Central audio manager for the game.
 */
class AudioHub {
    /** Initializes runtime state and API maps. */
    constructor() {
        this.sounds = new Map();
        this.masterVolume = 1;
        this.storageKeys = { muted: 'el-pollo-loco.muted' };
        this.muted = this.loadPersistedMuteState();
        this.playingMaster = false;

        this.startscreenAutoplayBootInProgress = false;
        this.startscreenAutoplayBootDone = false;

        this.gameSoundsRegistered = false;
        this.audioCacheBustToken = Date.now();
        this.effectTimestamps = {};

        this.gameSoundDefinitions = [
            { name: 'startscreenMusic', file: 'audio_startscreen_sound.mp3', loop: true, volume: 0.38 },
            { name: 'ingameMusic', file: 'audio_ingame_sound.mp3', loop: true, volume: 0.35 },
            { name: 'characterJump', file: 'audio_character_jump.mp3', volume: 0.55 },
            { name: 'characterRunning', file: 'audio_character_running.mp3', loop: true, volume: 0.28 },
            { name: 'characterSnore', file: 'audio_character_snore.wav', loop: true, volume: 0.22 },
            { name: 'characterHurt', file: 'audio_character_hurt.m4a', volume: 0.58 },
            { name: 'characterThrow', file: 'audio_character_throw.m4a', volume: 0.55 },
            { name: 'collectCoin', file: 'audio_collect_coin.m4a', volume: 0.56 },
            { name: 'collectBottle', file: 'audio_collect_bottle.mp3', volume: 0.56 },
            { name: 'bottleBreak', file: 'audio_bottle_breake.mp3', volume: 0.62 },
            { name: 'chickenHurt', file: 'audio_chicken_hurt.mp3', volume: 0.58 },
            { name: 'chickenWalking', file: 'audio_chicken_walking.mp3', loop: true, volume: 0.18 },
            { name: 'smallChickenWalking', file: 'audio_small_chicken_walking.mp3', loop: true, volume: 0.17 },
            { name: 'endbossIdle', file: 'audio_endboss_idle.wav', loop: true, volume: 0.2 },
            { name: 'endbossHurt', file: 'audio_endboss_hurt.mp3', volume: 0.62 },
            { name: 'endbossDead', file: 'audio_endboss_dead.wav', volume: 0.72 },
            { name: 'gameOver', file: 'audio_game_over.mp3', volume: 0.72 },
            { name: 'win', file: 'audio_win.m4a', volume: 0.74 }
        ];

        this.effectMethods = {
            playCharacterJump: ['characterJump', 120],
            playCharacterHurt: ['characterHurt', 350],
            playCharacterThrow: ['characterThrow', 140],
            playCollectCoin: ['collectCoin', 90],
            playCollectBottle: ['collectBottle', 110],
            playBottleBreak: ['bottleBreak', 120],
            playChickenHurt: ['chickenHurt', 140],
            playEndbossHurt: ['endbossHurt', 260],
            playEndbossDead: ['endbossDead', 1200]
        };

        this.bindEffectMethods();
    }

    /** Binds global APIs used in the game. */
    bindToWindow() {
        window.audioHub = this;
        window.gameSound = this;
        window.sound = this.createSoundFacade();
        window.addEventListener('load', () => this.initializeAudioHubOnLoad());
    }

    /** Creates the effect methods from one mapping table. */
    bindEffectMethods() {
        let methodNames = Object.keys(this.effectMethods);
        for (let index = 0; index < methodNames.length; index++) {
            let methodName = methodNames[index];
            let soundData = this.effectMethods[methodName];
            this[methodName] = () => this.playEffectWithCooldown(soundData[0], soundData[1]);
        }
    }

    /** Registers one sound once and returns audio element. */
    registerSound(name, url, options = {}) {
        if (this.sounds.has(name)) return this.sounds.get(name).audio;
        let audio = new Audio(url);
        let baseVolume = typeof options.volume === 'number' ? options.volume : 1;
        audio.preload = 'auto';
        audio.loop = !!options.loop;
        audio.volume = this.muted ? 0 : this.masterVolume * baseVolume;
        this.sounds.set(name, { audio, baseVolume, loop: audio.loop });
        return audio;
    }

    /** Returns whether one sound key exists. */
    hasSound(name) {
        return this.sounds.has(name);
    }

    /** Returns whether one sound is active. */
    isPlaying(name) {
        if (!this.sounds.has(name)) return false;
        let item = this.sounds.get(name);
        return !item.audio.paused && !item.audio.ended;
    }

    /** Plays one sound and handles startscreen autoplay fallback. */
    play(name) {
        let item = this.sounds.get(name);
        if (!item) return;
        item.audio.volume = this.muted ? 0 : this.masterVolume * item.baseVolume;
        if (name === 'startscreenMusic' && !this.startscreenAutoplayBootDone) {
            this.playStartscreenWithAutoplayFallback(item);
            return;
        }
        this.playSoundWithFallback(name, item);
    }

    /** Tries direct startscreen playback before muted autoplay fallback. */
    async playStartscreenWithAutoplayFallback(soundItem) {
        if (!soundItem) return;
        let didStart = await this.tryPlayAudio(soundItem.audio);
        if (didStart) {
            this.startscreenAutoplayBootDone = true;
            return;
        }
        this.tryStartscreenMutedAutoplay(soundItem);
    }

    /** Plays one sound and retries startscreen with muted bootstrap on failure. */
    async playSoundWithFallback(name, soundItem) {
        if (!soundItem) return;
        let didStart = await this.tryPlayAudio(soundItem.audio);
        if (!didStart && name === 'startscreenMusic') this.tryStartscreenMutedAutoplay(soundItem);
    }

    /** Tries one audio.play call and returns success state. */
    async tryPlayAudio(audio) {
        if (!audio) return false;
        try {
            await audio.play();
            return true;
        } catch (error) {
            return false;
        }
    }

    /** Tries muted autoplay bootstrap for startscreen music. */
    tryStartscreenMutedAutoplay(soundItem) {
        if (!this.canRunStartscreenAutoplayBoot(soundItem)) return;
        this.startscreenAutoplayBootInProgress = true;
        this.executeStartscreenAutoplayBoot(soundItem);
    }

    /** Checks if autoplay bootstrap may run. */
    canRunStartscreenAutoplayBoot(soundItem) {
        return !!soundItem && !this.startscreenAutoplayBootDone && !this.startscreenAutoplayBootInProgress;
    }

    /** Executes muted startscreen autoplay bootstrap. */
    async executeStartscreenAutoplayBoot(soundItem) {
        let audio = soundItem.audio;
        let targetVolume = this.resolveTargetVolume(soundItem);
        let didStart = false;
        this.prepareMutedAutoplayAttempt(audio);
        try {
            didStart = await this.runMutedAutoplayAttempt(audio);
        } catch (error) {
            didStart = false;
        }
        this.finalizeMutedAutoplayAttempt(audio, targetVolume, didStart);
    }

    /** Resolves target volume for one sound item. */
    resolveTargetVolume(soundItem) {
        return this.muted ? 0 : this.masterVolume * soundItem.baseVolume;
    }

    /** Prepares a muted autoplay attempt. */
    prepareMutedAutoplayAttempt(audio) {
        audio.muted = true;
        audio.volume = 0;
    }

    /** Runs one muted autoplay attempt. */
    async runMutedAutoplayAttempt(audio) {
        let mutedPlayPromise = audio.play();
        if (!mutedPlayPromise || typeof mutedPlayPromise.then !== 'function') return true;
        await mutedPlayPromise;
        return true;
    }

    /** Finalizes autoplay bootstrap and restores volume. */
    finalizeMutedAutoplayAttempt(audio, targetVolume, didStart) {
        audio.muted = false;
        audio.volume = targetVolume;
        this.startscreenAutoplayBootDone = didStart;
        this.startscreenAutoplayBootInProgress = false;
    }

    /** Pauses one sound. */
    pause(name) {
        let item = this.sounds.get(name);
        if (!item) return;
        item.audio.pause();
    }

    /** Stops and rewinds one sound. */
    stop(name) {
        let item = this.sounds.get(name);
        if (!item) return;
        item.audio.pause();
        item.audio.currentTime = 0;
    }

    /** Plays all looping sounds. */
    playAllLooping() {
        for (let [name, soundItem] of this.sounds) {
            if (soundItem.loop) this.play(name);
        }
        this.playingMaster = true;
    }

    /** Stops all registered sounds. */
    stopAll() {
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.pause();
            soundItem.audio.currentTime = 0;
        }
        this.playingMaster = false;
    }

    /** Sets master volume for all sounds. */
    setMasterVolume(value) {
        let volume = Math.max(0, Math.min(1, Number(value)));
        this.masterVolume = volume;
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.volume = this.muted ? 0 : this.masterVolume * soundItem.baseVolume;
        }
    }

    /** Loads mute state from localStorage. */
    loadPersistedMuteState() {
        let persistedValue = this.readStorageValue(this.storageKeys.muted);
        return persistedValue === 'true';
    }

    /** Persists current mute state in localStorage. */
    persistMuteState() {
        this.writeStorageValue(this.storageKeys.muted, String(this.muted));
    }

    /** Reads one localStorage value safely. */
    readStorageValue(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    /** Writes one localStorage value safely. */
    writeStorageValue(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            return;
        }
    }

    /** Mutes all sounds. */
    mute() {
        this.muted = true;
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.volume = 0;
        }
        this.persistMuteState();
    }

    /** Unmutes all sounds. */
    unmute() {
        this.muted = false;
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.volume = this.masterVolume * soundItem.baseVolume;
        }
        this.persistMuteState();
    }

    /** Toggles mute state. */
    toggleMute() {
        if (this.muted) this.unmute();
        else this.mute();
        return this.muted;
    }

    /** Returns mute state. */
    isMuted() {
        return this.muted;
    }

    /** Registers all game sounds once. */
    registerGameSounds() {
        for (let index = 0; index < this.gameSoundDefinitions.length; index++) {
            let definition = this.gameSoundDefinitions[index];
            let cacheBust = definition.name === 'bottleBreak' ? `?v=${this.audioCacheBustToken}` : '';
            let soundPath = `./assets/audio/${definition.file}${cacheBust}`;
            this.registerSound(definition.name, soundPath, { loop: !!definition.loop, volume: definition.volume });
        }
    }

    /** Ensures game sounds are registered exactly once. */
    ensureGameSoundsRegistered() {
        if (this.gameSoundsRegistered) return;
        this.registerGameSounds();
        this.gameSoundsRegistered = true;
    }

    /** Compatibility helper for existing gameSound usage. */
    ensureSetup() {
        this.ensureGameSoundsRegistered();
    }

    /** Starts or stops one loop sound. */
    setLoopState(name, shouldPlay) {
        if (!this.hasSound(name)) return;
        if (shouldPlay) {
            if (!this.isPlaying(name)) this.play(name);
            return;
        }
        if (this.isPlaying(name)) this.stop(name);
    }

    /** Stops all gameplay loops. */
    stopGameplayLoops() {
        this.stop('characterRunning');
        this.stop('characterSnore');
        this.stop('chickenWalking');
        this.stop('smallChickenWalking');
        this.stop('endbossIdle');
    }

    /** Restarts one effect immediately. */
    restartEffectNow(name) {
        this.stop(name);
        this.play(name);
    }

    /** Plays one effect with cooldown-aware retriggering. */
    playEffectWithCooldown(name, cooldownMs) {
        this.ensureGameSoundsRegistered();
        let now = Date.now();
        let lastTime = this.effectTimestamps[name] || 0;
        let isInOffset = now - lastTime < cooldownMs;
        if (isInOffset || this.isPlaying(name)) {
            this.effectTimestamps[name] = now;
            this.restartEffectNow(name);
            return;
        }
        this.effectTimestamps[name] = now;
        this.play(name);
    }

    /** Activates startscreen music mode. */
    toStartscreen() {
        this.ensureGameSoundsRegistered();
        this.stopGameplayLoops();
        this.stop('ingameMusic');
        this.stop('win');
        this.stop('gameOver');
        this.play('startscreenMusic');
    }

    /** Activates in-game music mode. */
    toIngame() {
        this.ensureGameSoundsRegistered();
        this.stop('startscreenMusic');
        this.stop('win');
        this.stop('gameOver');
        this.play('ingameMusic');
    }

    /** Plays win end-state audio. */
    onWin() { this.playEndState('win'); }

    /** Plays lose end-state audio. */
    onLose() { this.playEndState('gameOver'); }

    /** Plays one end-state sound and stops competing loops. */
    playEndState(soundName) {
        this.ensureGameSoundsRegistered();
        this.stopGameplayLoops();
        this.stop('startscreenMusic');
        this.stop('ingameMusic');
        this.stop('win');
        this.stop('gameOver');
        this.play(soundName);
    }

    /** Syncs character movement loops. */
    syncCharacterMovement(isRunning, isSnoring, isJumping) {
        this.ensureGameSoundsRegistered();
        if (isRunning) return this.setRunningLoopState();
        if (isSnoring) return this.setSnoringLoopState();
        if (isJumping) return this.setJumpingLoopState();
        this.setLoopState('characterRunning', false);
        this.setLoopState('characterSnore', false);
        this.setLoopState('characterJumping', false);
    }

    /** Activates running loop and stops snore loop. */
    setRunningLoopState() {
        this.setLoopState('characterRunning', true);
        this.setLoopState('characterSnore', false);
    }

    /** Activates snore loop and stops running loop. */
    setSnoringLoopState() {
        this.setLoopState('characterRunning', false);
        this.setLoopState('characterSnore', true);
    }

    /** Activates jumping loop and stops running and snore loops. */
    setJumpingLoopState() {
        this.setLoopState('characterRunning', false);
        this.setLoopState('characterSnore', false);
        this.setLoopState('characterJumping', true);
    }

    /** Syncs enemy ambience loops. */
    syncEnemyAmbience(hasChicken, hasSmallChicken) {
        this.ensureGameSoundsRegistered();
        this.setLoopState('chickenWalking', hasChicken);
        this.setLoopState('smallChickenWalking', hasSmallChicken);
    }

    /** Syncs endboss idle loop. */
    syncEndbossIdle(isActive) {
        this.ensureGameSoundsRegistered();
        this.setLoopState('endbossIdle', isActive);
    }

    /** Updates the sound button icon. */
    updateSoundButtonIcon(muted) {
        let button = document.getElementById('sound');
        if (!button) return;
        button.setAttribute('aria-pressed', muted ? 'true' : 'false');
        if (muted) return this.showMutedIcon(button);
        this.showUnmutedIcon(button);
    }

    /** Renders muted icon into sound button. */
    showMutedIcon(button) {
        button.innerHTML = '<img src="assets/icon/volume_off.svg" alt="Muted">';
    }

    /** Renders unmuted icon into sound button. */
    showUnmutedIcon(button) {
        button.innerHTML = '<img src="assets/icon/volume_up.svg" alt="Unmuted">';
    }

    /** Synchronizes slider value with current master volume. */
    syncSliderValue() {
        let slider = document.getElementById('audio-slider');
        if (!slider) return;
        slider.value = this.masterVolume;
    }

    /** Creates the sound facade consumed by ui-controls.class.js. */
    createSoundFacade() {
        let hub = this;
        return {
            hub,
            initUI() {
                hub.ensureGameSoundsRegistered();
                hub.syncSliderValue();
                hub.updateSoundButtonIcon(hub.isMuted());
            },
            updateButtonUI(muted) {
                hub.updateSoundButtonIcon(!!muted);
            },
            toggleMute() {
                let muted = hub.toggleMute();
                hub.updateSoundButtonIcon(muted);
                return muted;
            },
            setMasterVolume(value) {
                hub.ensureGameSoundsRegistered();
                hub.setMasterVolume(value);
                hub.updateSoundButtonIcon(Number(value) <= 0 || hub.isMuted());
            },
            positionDialog() { }
        };
    }

    /** Initializes audio facade once window load completes. */
    initializeAudioHubOnLoad() {
        this.ensureGameSoundsRegistered();
        if (window.sound && typeof window.sound.initUI === 'function') {
            window.sound.initUI();
        }
    }
}

new AudioHub().bindToWindow();