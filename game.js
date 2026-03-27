let canvas;
let world;
let keyboard = new Keyboard();

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
    closeAllInfoOverlays();
    showCanvasInfoButtons();

    let startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.classList.remove('hidden');
    }
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
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
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
 * Binds info overlay open and close interactions.
 */
function setupInformationButtons() {
    let imprintButton = document.getElementById('imprint-button');
    let descriptionButton = document.getElementById('description-button');
    let closeButtons = document.querySelectorAll('.info_close_button');
    let overlays = document.querySelectorAll('.info_overlay');

    if (imprintButton) {
        imprintButton.onclick = () => {
            openInfoOverlay('imprint-overlay');
        };
    }

    if (descriptionButton) {
        descriptionButton.onclick = () => {
            openInfoOverlay('description-overlay');
        };
    }

    for (let index = 0; index < closeButtons.length; index++) {
        closeButtons[index].onclick = () => {
            let overlayId = closeButtons[index].getAttribute('data-close-overlay');
            closeInfoOverlay(overlayId);
        };
    }

    for (let index = 0; index < overlays.length; index++) {
        overlays[index].onclick = (event) => {
            if (event.target === overlays[index]) {
                closeInfoOverlay(overlays[index].id);
            }
        };
    }
}

/**
 * Opens a specific info overlay and hides all others.
 * @param {string} overlayId The id of the overlay to open.
 */
function openInfoOverlay(overlayId) {
    closeAllInfoOverlays();
    let overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.classList.remove('d_none');
        overlay.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Closes a specific info overlay.
 * @param {string} overlayId The id of the overlay to close.
 */
function closeInfoOverlay(overlayId) {
    let overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.classList.add('d_none');
        overlay.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Closes all info overlays.
 */
function closeAllInfoOverlays() {
    let overlays = document.querySelectorAll('.info_overlay');
    for (let index = 0; index < overlays.length; index++) {
        overlays[index].classList.add('d_none');
        overlays[index].setAttribute('aria-hidden', 'true');
    }
}

/**
 * Hides the canvas info button row.
 */
function hideCanvasInfoButtons() {
    let infoButtons = document.getElementById('canvas-info-buttons');
    if (infoButtons) {
        infoButtons.classList.add('d_none');
    }
}

/**
 * Shows the canvas info button row.
 */
function showCanvasInfoButtons() {
    let infoButtons = document.getElementById('canvas-info-buttons');
    if (infoButtons) {
        infoButtons.classList.remove('d_none');
    }
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
    if (btn) {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isInputLocked()) return;
            keyboard[keyboardKey] = true;
        });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[keyboardKey] = false;
        });
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (isInputLocked()) return;
            keyboard[keyboardKey] = true;
        });
        btn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            keyboard[keyboardKey] = false;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    setupOrientationHandler();
    setupInformationButtons();
    initSoundUI();


    let startBtn = document.getElementById('start-button');
    let startScreen = document.getElementById('start-screen');
    if (startBtn && startScreen) {
        startBtn.onclick = () => {
            startScreen.classList.add('hidden');
            hideCanvasInfoButtons();
            closeAllInfoOverlays();
            startLevel();
        };
    }
});

/**
 * Initialize sound UI bindings and state.
 */
function initSoundUI() {
    if (!window.sound) return;
    if (typeof window.sound.initUI === 'function') window.sound.initUI();
    if (window.sound && window.sound.hub && typeof window.sound.hub.unmute === 'function') window.sound.hub.unmute();
    if (window.sound && typeof window.sound.updateButtonUI === 'function') window.sound.updateButtonUI(false);
    ensureSoundIcon();
    bindSoundButton();
    bindLabelDialog();
    bindSlider();
    bindDocumentCloseHandlers();
}

/**
 * Ensure the `sound` button has a visible icon (fallback when empty).
 */
function ensureSoundIcon() {
    const btn = document.getElementById('sound');
    if (!btn) return;
    if (btn.innerHTML.trim() === '') {
        btn.innerHTML = '<img src="assets/icon/volume_up.svg" alt="Unmuted">';
        btn.setAttribute('aria-pressed', 'false');
    }
}

/**
 * Bind sound button to toggle mute.
 */
function bindSoundButton() {
    const btn = document.getElementById('sound');
    if (!btn || !window.sound) return;
    btn.addEventListener('click', () => {
        let muted;
        if (window.sound && typeof window.sound.toggleMute === 'function') {
            muted = window.sound.toggleMute();
        } else if (window.audioHub && typeof window.audioHub.toggleMute === 'function') {
            muted = window.audioHub.toggleMute();
        } else {
            const pressed = btn.getAttribute('aria-pressed') === 'true';
            muted = !pressed;
        }
        if (window.sound && typeof window.sound.updateButtonUI === 'function') window.sound.updateButtonUI(muted);
        else {
            btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
            btn.innerHTML = '<img src="' + (
                muted ? 'assets/icon/volume_off.svg' : 'assets/icon/volume_up.svg'
            ) + '" alt="' + (muted ? 'Muted' : 'Unmuted') + '">';
        }
    });
}

/**
 * Bind label button to open/close the slider dialog.
 */
function bindLabelDialog() {
    const label = document.getElementById('audio-label');
    const dialog = document.getElementById('audio-slider-dialog');
    if (!label || !dialog) return;
    label.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (dialog.classList.contains('open')) { closeDialog(label, dialog); return; }
        openDialog(label, dialog);
    });
}

/**
 * Open slider dialog and position it.
 */
function openDialog(label, dialog) {
    dialog.classList.add('open');
    dialog.setAttribute('aria-hidden', 'false');
    label.setAttribute('aria-expanded', 'true');
    if (typeof window.sound.positionDialog === 'function') window.sound.positionDialog();
}

/**
 * Close slider dialog.
 */
function closeDialog(label, dialog) {
    dialog.classList.remove('open');
    dialog.setAttribute('aria-hidden', 'true');
    label.setAttribute('aria-expanded', 'false');
}

/**
 * Close dialog on outside click or Escape key.
 */
function bindDocumentCloseHandlers() {
    document.addEventListener('click', (e) => {
        const label = document.getElementById('audio-label');
        const dialog = document.getElementById('audio-slider-dialog');
        if (!label || !dialog) return;
        if (!label.contains(e.target) && !dialog.contains(e.target)) closeDialog(label, dialog);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            const label = document.getElementById('audio-label');
            const dialog = document.getElementById('audio-slider-dialog');
            if (label && dialog) closeDialog(label, dialog);
        }
    });
}

/**
 * Apply mute/unmute to hub and button UI.
 * @param {boolean} muted True to mute, false to unmute.
 */
function applyMuteState(muted) {
    const btn = document.getElementById('sound');
    if (muted) {
        if (window.sound && window.sound.hub && typeof window.sound.hub.mute === 'function') window.sound.hub.mute();
        else if (window.audioHub && typeof window.audioHub.mute === 'function') window.audioHub.mute();
        if (window.sound && typeof window.sound.updateButtonUI === 'function') window.sound.updateButtonUI(true);
        else if (btn) { btn.setAttribute('aria-pressed', 'true'); btn.innerHTML = '<img src="assets/icon/volume_off.svg" alt="Muted">'; }
        return;
    }
    if (window.sound && window.sound.hub && typeof window.sound.hub.unmute === 'function') window.sound.hub.unmute();
    else if (window.audioHub && typeof window.audioHub.unmute === 'function') window.audioHub.unmute();
    if (window.sound && typeof window.sound.updateButtonUI === 'function') window.sound.updateButtonUI(false);
    else if (btn) { btn.setAttribute('aria-pressed', 'false'); btn.innerHTML = '<img src="assets/icon/volume_up.svg" alt="Unmuted">'; }
}

/**
 * Bind slider input to update master volume.
 */
function bindSlider() {
    const slider = document.getElementById('audio-slider');
    if (!slider) return;
    slider.addEventListener('input', (e) => {
        const v = Number(e.target.value);
        if (window.sound && typeof window.sound.setMasterVolume === 'function') window.sound.setMasterVolume(v);
        else if (window.sound && window.sound.hub && typeof window.sound.hub.setMasterVolume === 'function') window.sound.hub.setMasterVolume(v);
        else if (window.audioHub && typeof window.audioHub.setMasterVolume === 'function') window.audioHub.setMasterVolume(v);
        applyMuteState(v <= 0);
    });
    if (window.sound && window.sound.hub) slider.value = window.sound.hub.masterVolume || 1;
    else if (window.audioHub) slider.value = window.audioHub.masterVolume || 1;
}

window.addEventListener('keydown', (event) => {
    if (isInputLocked()) {
        return;
    }

    if (event.key == 39 || event.key === 'd')
        keyboard.right = true;
    if (event.key == 37 || event.key === 'a')
        keyboard.left = true;
    if (event.key == 38 || event.key === 'w')
        keyboard.up = true;
    if (event.key == 40 || event.key === 's')
        keyboard.down = true;
    if (event.key == 32 || event.key === ' ')
        keyboard.space = true;


});

window.addEventListener('keyup', (event) => {
    if (event.key == 39 || event.key === 'd')
        keyboard.right = false;
    if (event.key == 37 || event.key === 'a')
        keyboard.left = false;
    if (event.key == 38 || event.key === 'w')
        keyboard.up = false;
    if (event.key == 40 || event.key === 's')
        keyboard.down = false;
    if (event.key == 32 || event.key === ' ')
        keyboard.space = false;
});


