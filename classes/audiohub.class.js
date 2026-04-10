/**
 * Verwaltet alle Audios zentral fuer das Spiel.
 */
class AudioHub {
    /**
     * Erstellt den Audio-Container mit Standardwerten.
     */
    constructor() {
        this.sounds = new Map();
        this.masterVolume = 1;
        this.muted = false;
        this.playingMaster = false;
    }
    /**
     * Registriert einen Sound einmalig im Hub.
     * @param {string} name Interner Soundname.
     * @param {string} url Dateipfad.
     * @param {{loop?: boolean, volume?: number}} options Audio-Optionen.
     * @returns {HTMLAudioElement} Registriertes Audioelement.
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
     * Prueft, ob ein Sound existiert.
     * @param {string} name Interner Soundname.
     * @returns {boolean} True wenn vorhanden.
     */
    hasSound(name) {
        return this.sounds.has(name);
    }
    /**
     * Prueft, ob ein Sound gerade laeuft.
     * @param {string} name Interner Soundname.
     * @returns {boolean} True wenn Audio aktiv ist.
     */
    isPlaying(name) {
        if (!this.sounds.has(name)) return false;
        let item = this.sounds.get(name);
        return !item.audio.paused && !item.audio.ended;
    }
    /**
     * Spielt einen registrierten Sound.
     * @param {string} name Interner Soundname.
     */
    play(name) {
        let item = this.sounds.get(name);
        if (!item) return;
        item.audio.volume = this.muted ? 0 : this.masterVolume * item.baseVolume;
        let playPromise = item.audio.play();
        if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => { });
    }
    /**
     * Pausiert einen Sound.
     * @param {string} name Interner Soundname.
     */
    pause(name) {
        let item = this.sounds.get(name);
        if (!item) return;
        item.audio.pause();
    }
    /**
     * Stoppt einen Sound und setzt ihn zurueck.
     * @param {string} name Interner Soundname.
     */
    stop(name) {
        let item = this.sounds.get(name);
        if (!item) return;
        item.audio.pause();
        item.audio.currentTime = 0;
    }
    /**
     * Spielt alle als Loop registrierten Sounds.
     */
    playAllLooping() {
        for (let [name, soundItem] of this.sounds) {
            if (soundItem.loop) this.play(name);
        }
        this.playingMaster = true;
    }
    /**
     * Stoppt alle registrierten Sounds.
     */
    stopAll() {
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.pause();
            soundItem.audio.currentTime = 0;
        }
        this.playingMaster = false;
    }
    /**
     * Setzt die globale Lautstaerke.
     * @param {number} value Zielwert zwischen 0 und 1.
     */
    setMasterVolume(value) {
        let volume = Math.max(0, Math.min(1, Number(value)));
        this.masterVolume = volume;
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.volume = this.muted ? 0 : this.masterVolume * soundItem.baseVolume;
        }
    }
    /**
     * Schaltet alle Sounds stumm.
     */
    mute() {
        this.muted = true;
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.volume = 0;
        }
    }
    /**
     * Hebt die Stummschaltung auf.
     */
    unmute() {
        this.muted = false;
        for (let [, soundItem] of this.sounds) {
            soundItem.audio.volume = this.masterVolume * soundItem.baseVolume;
        }
    }
    /**
     * Schaltet zwischen Mute und Unmute um.
     * @returns {boolean} Aktueller Mute-Status.
     */
    toggleMute() {
        if (this.muted) this.unmute();
        else this.mute();
        return this.muted;
    }
    /**
     * Liefert den Mute-Status.
     * @returns {boolean} True wenn gemutet.
     */
    isMuted() {
        return this.muted;
    }
}
window.audioHub = new AudioHub();
let gameSoundsRegistered = false;
let audioCacheBustToken = Date.now();
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
 * Registriert alle Sounds aus der Mapping-Liste.
 */
function registerGameSounds() {
    for (let index = 0; index < gameSoundDefinitions.length; index++) {
        let definition = gameSoundDefinitions[index];
        let cacheBust = definition.name === 'bottleBreak' ? `?v=${audioCacheBustToken}` : '';
        let soundPath = `./assets/audio/${definition.file}${cacheBust}`;
        window.audioHub.registerSound(definition.name, soundPath, { loop: !!definition.loop, volume: definition.volume });
    }
}
/**
 * Initialisiert die Sound-Registrierung genau einmal.
 */
function ensureGameSoundsRegistered() {
    if (gameSoundsRegistered) return;
    registerGameSounds();
    gameSoundsRegistered = true;
}
/**
 * Startet oder stoppt einen Loop-Sound.
 * @param {AudioHub} hub Audio-Instanz.
 * @param {string} name Interner Soundname.
 * @param {boolean} shouldPlay True startet, false stoppt.
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
 * Stoppt alle Gameplay-Loop-Sounds.
 * @param {AudioHub} hub Audio-Instanz.
 */
function stopGameplayLoops(hub) {
    hub.stop('characterRunning');
    hub.stop('characterSnore');
    hub.stop('chickenWalking');
    hub.stop('smallChickenWalking');
    hub.stop('endbossIdle');
}
/**
 * Spielt einen Effekt mit Cooldown und Sofort-Neustart bei Re-Trigger.
 * @param {AudioHub} hub Audio-Instanz.
 * @param {Object} timestamps Zeitstempel-Map.
 * @param {string} name Effektname.
 * @param {number} cooldownMs Mindestabstand in Millisekunden.
 */
function restartEffectNow(hub, name) {
    hub.stop(name);
    hub.play(name);
}

/**
 * Spielt einen Effekt mit Offset und erzwingt bei Re-Trigger direkten Neustart.
 * @param {AudioHub} hub Audio-Instanz.
 * @param {Object} timestamps Zeitstempel-Map.
 * @param {string} name Effektname.
 * @param {number} cooldownMs Mindestabstand in Millisekunden.
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
/** Aktiviert die Startscreen-Musik. */
function playStartscreenMusic(hub) {
    ensureGameSoundsRegistered();
    stopGameplayLoops(hub);
    hub.stop('ingameMusic');
    hub.stop('win');
    hub.stop('gameOver');
    hub.play('startscreenMusic');
}

/** Aktiviert den Ingame-Musikmodus. */
function playIngameMusic(hub) {
    ensureGameSoundsRegistered();
    hub.stop('startscreenMusic');
    hub.stop('win');
    hub.stop('gameOver');
    hub.play('ingameMusic');
}

/** Spielt einen Endzustands-Sound. */
function playEndStateSound(hub, soundName) {
    ensureGameSoundsRegistered();
    stopGameplayLoops(hub);
    hub.stop('startscreenMusic');
    hub.stop('ingameMusic');
    hub.stop('win');
    hub.stop('gameOver');
    hub.play(soundName);
}

/** Synchronisiert Character-Loop-Sounds. */
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

/** Synchronisiert gegnerische Lauf-Ambience. */
function syncEnemyLoops(hub, hasChicken, hasSmallChicken) {
    ensureGameSoundsRegistered();
    setLoopState(hub, 'chickenWalking', hasChicken);
    setLoopState(hub, 'smallChickenWalking', hasSmallChicken);
}

/** Synchronisiert den Endboss-Idle-Loop. */
function syncEndbossLoop(hub, isActive) {
    ensureGameSoundsRegistered();
    setLoopState(hub, 'endbossIdle', isActive);
}

/** Baut den Kern der Gameplay-Sound-API. */
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

/** Ergaenzt die haeufigen Effekt-Methoden. */
function addPrimaryEffectApi(bridge, hub, effectTimestamps) {
    bridge.playCharacterJump = () => playEffectWithCooldown(hub, effectTimestamps, 'characterJump', 120);
    bridge.playCharacterHurt = () => playEffectWithCooldown(hub, effectTimestamps, 'characterHurt', 350);
    bridge.playCharacterThrow = () => playEffectWithCooldown(hub, effectTimestamps, 'characterThrow', 140);
    bridge.playCollectCoin = () => playEffectWithCooldown(hub, effectTimestamps, 'collectCoin', 90);
    bridge.playCollectBottle = () => playEffectWithCooldown(hub, effectTimestamps, 'collectBottle', 110);
}

/** Ergaenzt weitere Effekt-Methoden. */
function addSecondaryEffectApi(bridge, hub, effectTimestamps) {
    bridge.playBottleBreak = () => playEffectWithCooldown(hub, effectTimestamps, 'bottleBreak', 120);
    bridge.playChickenHurt = () => playEffectWithCooldown(hub, effectTimestamps, 'chickenHurt', 140);
    bridge.playEndbossHurt = () => playEffectWithCooldown(hub, effectTimestamps, 'endbossHurt', 260);
    bridge.playEndbossDead = () => playEffectWithCooldown(hub, effectTimestamps, 'endbossDead', 1200);
}

/** Baut die finale Bridge fuer gameplay-bezogene Sounds. */
function createGameSoundBridge(hub) {
    let effectTimestamps = {};
    let bridge = createCoreBridgeApi(hub);
    addPrimaryEffectApi(bridge, hub, effectTimestamps);
    addSecondaryEffectApi(bridge, hub, effectTimestamps);
    return bridge;
}
/**
 * Aktualisiert das Sound-Icon im Button.
 * @param {boolean} muted True bei Mute.
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
 * Synchronisiert den Slider mit der Master-Lautstaerke.
 * @param {AudioHub} hub Audio-Instanz.
 */
function syncSliderValue(hub) {
    let slider = document.getElementById('audio-slider');
    if (!slider) return;
    slider.value = hub.masterVolume;
}
/** Baut die bestehende Sound-API fuer game.js. */
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
 * Fuehrt die Audio-Initialisierung nach dem Laden aus.
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
