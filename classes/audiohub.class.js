/**
 * Central audio manager for the game.
 */
class AudioHub {
    /**
     * Creates the audio container with default values.
     */
    constructor() {
        this.sounds = new Map();
        this.masterVolume = 1;
        this.muted = false;
        this.playingMaster = false;
    }
    /**
     * Registers one sound in the hub.
     * @param {string} name Internal sound key.
     * @param {string} url File path.
     * @param {{loop?: boolean, volume?: number}} options Audio options.
     * @returns {HTMLAudioElement} Registered audio element.
     */
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
    /**
     * Returns whether a sound key exists.
     * @param {string} name Internal sound key.
     * @returns {boolean} True when present.
     */
    hasSound(name) {
        return this.sounds.has(name);
    }
    /**
     * Returns whether a sound is currently playing.
     * @param {string} name Internal sound key.
     * @returns {boolean} True when audio is active.
     */
    isPlaying(name) {
        if (!this.sounds.has(name)) return false;
        let item = this.sounds.get(name);
        return !item.audio.paused && !item.audio.ended;
    }
    /**
     * Plays one registered sound.
     * @param {string} name Internal sound key.
     */
    play(name) {
        let item = this.sounds.get(name);
        if (!item) return;
        item.audio.volume = this.muted ? 0 : this.masterVolume * item.baseVolume;
        let playPromise = item.audio.play();
        if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => { });
    }
    /**
     * Pauses one sound.
     * @param {string} name Internal sound key.
     */
    pause(name) {
        let item = this.sounds.get(name);
        if (!item) return;
        item.audio.pause();
    }
    /**
     * Stops one sound and rewinds it.
     * @param {string} name Internal sound key.
     */
    stop(name) {
        let item = this.sounds.get(name);
        if (!item) return;
        item.audio.pause();
        item.audio.currentTime = 0;
    }
    /**
     * Plays all sounds registered as loops.
     */
    playAllLooping() {
        for (let [name, soundItem] of this.sounds) {
            if (soundItem.loop) this.play(name);
        }
        this.playingMaster = true;
    }
    /**
     * Stops all registered sounds.
     */
    stopAll() {
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.pause();
            soundItem.audio.currentTime = 0;
        }
        this.playingMaster = false;
    }
    /**
     * Sets global master volume.
     * @param {number} value Target value between 0 and 1.
     */
    setMasterVolume(value) {
        let volume = Math.max(0, Math.min(1, Number(value)));
        this.masterVolume = volume;
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.volume = this.muted ? 0 : this.masterVolume * soundItem.baseVolume;
        }
    }
    /**
     * Mutes all sounds.
     */
    mute() {
        this.muted = true;
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.volume = 0;
        }
    }
    /**
     * Unmutes all sounds.
     */
    unmute() {
        this.muted = false;
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.volume = this.masterVolume * soundItem.baseVolume;
        }
    }
    /**
     * Toggles mute state.
     * @returns {boolean} Current mute state.
     */
    toggleMute() {
        if (this.muted) this.unmute();
        else this.mute();
        return this.muted;
    }
    /**
     * Returns current mute state.
     * @returns {boolean} True when muted.
     */
    isMuted() {
        return this.muted;
    }
}
window.audioHub = new AudioHub();
let gameSoundsRegistered = false;
let gameSoundDefinitions = [
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
/**
 * Registers all sounds from the mapping list.
 */
function registerGameSounds() {
    for (let index = 0; index < gameSoundDefinitions.length; index++) {
        let definition = gameSoundDefinitions[index];
        let soundPath = `./assets/audio/${definition.file}`;
        window.audioHub.registerSound(definition.name, soundPath, { loop: !!definition.loop, volume: definition.volume });
    }
}
/**
 * Initializes sound registration exactly once.
 */
function ensureGameSoundsRegistered() {
    if (gameSoundsRegistered) return;
    registerGameSounds();
    gameSoundsRegistered = true;
}
/**
 * Starts or stops one loop sound.
 * @param {AudioHub} hub Audio instance.
 * @param {string} name Internal sound key.
 * @param {boolean} shouldPlay True starts, false stops.
 */
function setLoopState(hub, name, shouldPlay) {
    if (!hub.hasSound(name)) return;
    if (shouldPlay) {
        if (!hub.isPlaying(name)) hub.play(name);
        return;
    }
    if (hub.isPlaying(name)) hub.stop(name);
}
/**
 * Stops all gameplay loop sounds.
 * @param {AudioHub} hub Audio instance.
 */
function stopGameplayLoops(hub) {
    hub.stop('characterRunning');
    hub.stop('characterSnore');
    hub.stop('chickenWalking');
    hub.stop('smallChickenWalking');
    hub.stop('endbossIdle');
}
/**
 * Immediately restarts an effect sound.
 * @param {AudioHub} hub Audio instance.
 * @param {string} name Effect name.
 */
function restartEffectNow(hub, name) {
    hub.stop(name);
    hub.play(name);
}

/**
 * Plays an effect with cooldown handling and immediate retrigger restart.
 * @param {AudioHub} hub Audio instance.
 * @param {Object} timestamps Timestamp map.
 * @param {string} name Effect name.
 * @param {number} cooldownMs Minimum delay in milliseconds.
 */
function playEffectWithCooldown(hub, timestamps, name, cooldownMs) {
    ensureGameSoundsRegistered();
    let now = Date.now();
    let lastTime = timestamps[name] || 0;
    let isInOffset = now - lastTime < cooldownMs;
    if (isInOffset || hub.isPlaying(name)) {
        timestamps[name] = now;
        restartEffectNow(hub, name);
        return;
    }
    timestamps[name] = now;
    hub.play(name);
}
/** Activates startscreen music. */
function playStartscreenMusic(hub) {
    ensureGameSoundsRegistered();
    stopGameplayLoops(hub);
    hub.stop('ingameMusic');
    hub.stop('win');
    hub.stop('gameOver');
    hub.play('startscreenMusic');
}

/** Activates in-game music mode. */
function playIngameMusic(hub) {
    ensureGameSoundsRegistered();
    hub.stop('startscreenMusic');
    hub.stop('win');
    hub.stop('gameOver');
    hub.play('ingameMusic');
}

/** Plays one end-state sound. */
function playEndStateSound(hub, soundName) {
    ensureGameSoundsRegistered();
    stopGameplayLoops(hub);
    hub.stop('startscreenMusic');
    hub.stop('ingameMusic');
    hub.stop('win');
    hub.stop('gameOver');
    hub.play(soundName);
}

/** Synchronizes character loop sounds. */
function syncCharacterLoops(hub, isRunning, isSnoring) {
    ensureGameSoundsRegistered();
    if (isRunning) {
        setLoopState(hub, 'characterRunning', true);
        setLoopState(hub, 'characterSnore', false);
        return;
    }
    if (isSnoring) {
        setLoopState(hub, 'characterRunning', false);
        setLoopState(hub, 'characterSnore', true);
        return;
    }
    setLoopState(hub, 'characterRunning', false); setLoopState(hub, 'characterSnore', false);
}

/** Synchronizes enemy walking ambience. */
function syncEnemyLoops(hub, hasChicken, hasSmallChicken) {
    ensureGameSoundsRegistered();
    setLoopState(hub, 'chickenWalking', hasChicken);
    setLoopState(hub, 'smallChickenWalking', hasSmallChicken);
}

/** Synchronizes endboss idle loop. */
function syncEndbossLoop(hub, isActive) {
    ensureGameSoundsRegistered();
    setLoopState(hub, 'endbossIdle', isActive);
}

/** Builds the core gameplay sound API bridge. */
function createCoreBridgeApi(hub) {
    return {
        ensureSetup: ensureGameSoundsRegistered,
        stopGameplayLoops() { stopGameplayLoops(hub); },
        toStartscreen() { playStartscreenMusic(hub); },
        toIngame() { playIngameMusic(hub); },
        onWin() { playEndStateSound(hub, 'win'); },
        onLose() { playEndStateSound(hub, 'gameOver'); },
        syncCharacterMovement(isRunning, isSnoring) { syncCharacterLoops(hub, isRunning, isSnoring); },
        syncEnemyAmbience(hasChicken, hasSmallChicken) { syncEnemyLoops(hub, hasChicken, hasSmallChicken); },
        syncEndbossIdle(isActive) { syncEndbossLoop(hub, isActive); }
    };
}

/** Adds primary effect methods to the bridge. */
function addPrimaryEffectApi(bridge, hub, effectTimestamps) {
    bridge.playCharacterJump = () => playEffectWithCooldown(hub, effectTimestamps, 'characterJump', 120);
    bridge.playCharacterHurt = () => playEffectWithCooldown(hub, effectTimestamps, 'characterHurt', 350);
    bridge.playCharacterThrow = () => playEffectWithCooldown(hub, effectTimestamps, 'characterThrow', 140);
    bridge.playCollectCoin = () => playEffectWithCooldown(hub, effectTimestamps, 'collectCoin', 90);
    bridge.playCollectBottle = () => playEffectWithCooldown(hub, effectTimestamps, 'collectBottle', 110);
}

/** Adds secondary effect methods to the bridge. */
function addSecondaryEffectApi(bridge, hub, effectTimestamps) {
    bridge.playBottleBreak = () => playEffectWithCooldown(hub, effectTimestamps, 'bottleBreak', 120);
    bridge.playChickenHurt = () => playEffectWithCooldown(hub, effectTimestamps, 'chickenHurt', 140);
    bridge.playEndbossHurt = () => playEffectWithCooldown(hub, effectTimestamps, 'endbossHurt', 260);
    bridge.playEndbossDead = () => playEffectWithCooldown(hub, effectTimestamps, 'endbossDead', 1200);
}

/** Builds the final bridge for gameplay sound methods. */
function createGameSoundBridge(hub) {
    let effectTimestamps = {};
    let bridge = createCoreBridgeApi(hub);
    addPrimaryEffectApi(bridge, hub, effectTimestamps);
    addSecondaryEffectApi(bridge, hub, effectTimestamps);
    return bridge;
}
/**
 * Updates the sound icon in the button.
 * @param {boolean} muted True when muted.
 */
function updateSoundButtonIcon(muted) {
    let button = document.getElementById('sound');
    if (!button) return;
    button.setAttribute('aria-pressed', muted ? 'true' : 'false');
    if (muted) {
        button.innerHTML = '<img src="assets/icon/volume_off.svg" alt="Muted">';
        return;
    }
    button.innerHTML = '<img src="assets/icon/volume_up.svg" alt="Unmuted">';
}
/**
 * Synchronizes slider value with master volume.
 * @param {AudioHub} hub Audio instance.
 */
function syncSliderValue(hub) {
    let slider = document.getElementById('audio-slider');
    if (!slider) return;
    slider.value = hub.masterVolume;
}
/** Builds the sound facade used by game.js. */
function createSoundFacade(hub) {
    return {
        hub,
        initUI() { ensureGameSoundsRegistered(); syncSliderValue(hub); updateSoundButtonIcon(hub.isMuted()); },
        updateButtonUI(muted) { updateSoundButtonIcon(!!muted); },
        toggleMute() { let muted = hub.toggleMute(); updateSoundButtonIcon(muted); return muted; },
        setMasterVolume(value) { ensureGameSoundsRegistered(); hub.setMasterVolume(value); updateSoundButtonIcon(Number(value) <= 0 || hub.isMuted()); },
        positionDialog() { }
    };
}
/**
 * Runs audio initialization after page load.
 */
function initializeAudioHubOnLoad() {
    ensureGameSoundsRegistered();
    if (window.sound && typeof window.sound.initUI === 'function') {
        window.sound.initUI();
    }
}
window.gameSound = createGameSoundBridge(window.audioHub);
window.sound = createSoundFacade(window.audioHub);
let previousWindowOnLoad = window.onload;
window.onload = function () {
    if (typeof previousWindowOnLoad === 'function') {
        previousWindowOnLoad();
    }
    initializeAudioHubOnLoad();
};
