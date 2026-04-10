let canvas;
let world;
let keyboard = new Keyboard();
let startscreenAutoplayFallbackInitialized = false;

/**
 * Initializes canvas and static control bindings.
 */
function init() {
    canvas = document.getElementById('canvas');
    setupEndscreenButtons();
    setupMobileControls();
}

/**
 * Starts a fresh game world and resets UI state.
 */
function startLevel() {
    stopRunningWorld();
    if (typeof startLevelOne === 'function') {
        startLevelOne();
    }
    resetKeyboardState();
    hideEndscreenActions();
    if (!canvas) {
        canvas = document.getElementById('canvas');
    }
    world = new World(canvas, keyboard);
    activateGameplaySound();
    showMobileControls();
}

/**
 * Disposes the active world instance.
 */
function stopRunningWorld() {
    if (world && typeof world.dispose === 'function') {
        world.dispose();
    }
    world = null;
}

/**
 * Resets all keyboard input flags.
 */
function resetKeyboardState() {
    keyboard.left = false;
    keyboard.right = false;
    keyboard.up = false;
    keyboard.down = false;
    keyboard.space = false;
}

/**
 * Returns the game from gameplay view to the start screen.
 */
function returnToStartView() {
    stopRunningWorld();
    resetKeyboardState();
    hideEndscreenActions();
    hideMobileControls();
    window.uiControls.closeAllInfoOverlays();
    window.uiControls.showCanvasInfoButtons();

    let startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.classList.remove('hidden');
    }
    activateStartscreenSound();
}

/**
 * Shows mobile controls.
 */
function showMobileControls() {
    let mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.add('active');
    }
}

/**
 * Hides mobile controls.
 */
function hideMobileControls() {
    let mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.remove('active');
    }
}

/**
 * Registers orientation-related event handlers.
 */
function setupOrientationHandler() {
    checkOrientation();
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);
}

/**
 * Toggles orientation overlay based on current viewport orientation.
 */
function checkOrientation() {
    let overlay = document.getElementById('portrait-overlay');
    if (!overlay) return;

    let isPortrait = window.innerHeight > window.innerWidth;
    let isSmallDevice = window.innerWidth <= 1024;

    if (isPortrait && isSmallDevice) {
        overlay.classList.add('visible');
    } else {
        overlay.classList.remove('visible');
    }
}

/**
 * Binds endscreen action buttons.
 */
function setupEndscreenButtons() {
    let retryBtn = document.getElementById('retry-button');
    let homeBtn = document.getElementById('home-button');

    if (retryBtn) {
        retryBtn.onclick = () => {
            startLevel();
        };
    }

    if (homeBtn) {
        homeBtn.onclick = () => {
            returnToStartView();
        };
    }
}

/**
 * Hides endscreen action buttons and updates aria state.
 */
function hideEndscreenActions() {
    let actionContainer = document.getElementById('endscreen-actions');
    if (actionContainer) {
        actionContainer.classList.remove('visible');
        actionContainer.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Shows endscreen action buttons and updates aria state.
 */
function showEndscreenActions() {
    let actionContainer = document.getElementById('endscreen-actions');
    if (actionContainer) {
        actionContainer.classList.add('visible');
        actionContainer.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Moves the right mobile control group slightly left.
 */
function applyRightGroupShift() {
    let rightGroup = document.querySelector('.mobile_controls_right');
    if (rightGroup && !rightGroup.classList.contains('shift-left')) {
        rightGroup.classList.add('shift-left');
    }
}

/**
 * Sets up all mobile gameplay buttons.
 */
function setupMobileControls() {
    setupMobileButton('btn-left', 'left');
    setupMobileButton('btn-right', 'right');
    setupMobileButton('btn-jump', 'up');
    setupMobileButton('btn-throw', 'space');
    applyRightGroupShift();
}

/**
 * Returns whether player input is currently blocked.
 * @returns {boolean} True when input is locked.
 */
function isInputLocked() {
    return !!(world && world.frozen);
}

/**
 * Binds touch and mouse handlers to one mobile control button.
 * @param {string} buttonId DOM id of the button.
 * @param {string} keyboardKey Keyboard state key to toggle.
 */
function setupMobileButton(buttonId, keyboardKey) {
    let btn = document.getElementById(buttonId);
    if (!btn) return;
    bindMobilePressControl(btn, keyboardKey, 'touchstart', 'touchend');
    bindMobilePressControl(btn, keyboardKey, 'mousedown', 'mouseup');
}

/**
 * Binds press and release events to one mobile button.
 * @param {HTMLElement} btn Target button.
 * @param {string} keyboardKey Keyboard state key.
 * @param {string} pressEvent Press event name.
 * @param {string} releaseEvent Release event name.
 */
function bindMobilePressControl(btn, keyboardKey, pressEvent, releaseEvent) {
    btn.addEventListener(pressEvent, (event) => {
        event.preventDefault();
        if (isInputLocked()) return;
        setKeyboardKeyState(keyboardKey, true);
    });
    btn.addEventListener(releaseEvent, (event) => {
        event.preventDefault();
        setKeyboardKeyState(keyboardKey, false);
    });
}

/**
 * Sets one keyboard state value.
 * @param {string} keyboardKey Keyboard state key.
 * @param {boolean} value Target value.
 */
function setKeyboardKeyState(keyboardKey, value) {
    keyboard[keyboardKey] = value;
}

document.addEventListener('DOMContentLoaded', onDomContentLoaded);

/**
 * Runs initialization after DOM content is loaded.
 */
function onDomContentLoaded() {
    init();
    setupOrientationHandler();
    window.uiControls.setupInformationButtons();
    window.uiControls.initSoundUI();
    activateStartscreenSound();
    initializeStartscreenAutoplayFallback();

    bindStartButton();
}

/**
 * Registers fallback events if the browser blocks initial autoplay.
 */
function initializeStartscreenAutoplayFallback() {
    if (startscreenAutoplayFallbackInitialized) return;
    startscreenAutoplayFallbackInitialized = true;
    window.addEventListener('load', tryStartscreenSoundPlayback, { once: true });
    bindStartscreenUnlockEvents();
}

/**
 * Binds one-time unlock events for audio playback.
 */
function bindStartscreenUnlockEvents() {
    let unlockEvents = ['pointerdown', 'keydown', 'touchstart'];
    for (let index = 0; index < unlockEvents.length; index++) {
        document.addEventListener(unlockEvents[index], tryStartscreenSoundPlayback, {
            once: true,
            passive: true
        });
    }
}

/**
 * Retries startscreen sound while the startscreen is visible.
 */
function tryStartscreenSoundPlayback() {
    if (!isStartscreenVisible()) return;
    if (isStartscreenSoundPlaying()) return;
    activateStartscreenSound();
}

/**
 * Returns whether the startscreen is currently visible.
 * @returns {boolean} True when startscreen is visible.
 */
function isStartscreenVisible() {
    let startScreen = document.getElementById('start-screen');
    if (!startScreen) return false;
    return !startScreen.classList.contains('hidden');
}

/**
 * Returns whether startscreen music is already playing.
 * @returns {boolean} True when startscreen music is active.
 */
function isStartscreenSoundPlaying() {
    if (!window.audioHub || typeof window.audioHub.isPlaying !== 'function') return false;
    return window.audioHub.isPlaying('startscreenMusic');
}

/**
 * Activates startscreen sound mode.
 */
function activateStartscreenSound() {
    if (!window.gameSound) return;
    if (typeof window.gameSound.toStartscreen === 'function') {
        window.gameSound.toStartscreen();
    }
}

/**
 * Activates in-game sound mode.
 */
function activateGameplaySound() {
    if (!window.gameSound) return;
    if (typeof window.gameSound.toIngame === 'function') {
        window.gameSound.toIngame();
    }
}

/**
 * Binds the start button handler.
 */
function bindStartButton() {
    let startBtn = document.getElementById('start-button');
    let startScreen = document.getElementById('start-screen');
    if (startBtn && startScreen) {
        startBtn.onclick = () => {
            startScreen.classList.add('hidden');
            window.uiControls.hideCanvasInfoButtons();
            window.uiControls.closeAllInfoOverlays();
            startLevel();
        };
    }
}

window.addEventListener('keydown', (event) => {
    if (isInputLocked()) {
        return;
    }

    if (event.key == 39 || event.key === 'd' || event.key === 'ArrowRight')
        keyboard.right = true;
    if (event.key == 37 || event.key === 'a' || event.key === 'ArrowLeft')
        keyboard.left = true;
    if (event.key == 38 || event.key === 'w' || event.key === 'ArrowUp')
        keyboard.up = true;
    if (event.key == 40 || event.key === 's' || event.key === 'ArrowDown')
        keyboard.down = true;
    if (event.key == 32 || event.key === ' ')
        keyboard.space = true;


});

window.addEventListener('keyup', (event) => {
    if (event.key == 39 || event.key === 'd' || event.key === 'ArrowRight')
        keyboard.right = false;
    if (event.key == 37 || event.key === 'a' || event.key === 'ArrowLeft')
        keyboard.left = false;
    if (event.key == 38 || event.key === 'w' || event.key === 'ArrowUp')
        keyboard.up = false;
    if (event.key == 40 || event.key === 's' || event.key === 'ArrowDown')
        keyboard.down = false;
    if (event.key == 32 || event.key === ' ')
        keyboard.space = false;
});


