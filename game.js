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


