let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Initialisiert das Spiel: Canvas, World, Buttons und Mobile Controls.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    setupRetryButton();
    setupMobileControls();
    showMobileControls();
}

/**
 * Zeigt die mobilen Steuerknöpfe an, nachdem das Spiel gestartet wurde.
 */
function showMobileControls() {
    let mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.add('active');
    }
}

/**
 * Richtet den Orientation-Change-Listener ein, um Portrait-Overlay zu steuern.
 * Wird beim DOMContentLoaded ausgeführt.
 */
function setupOrientationHandler() {
    checkOrientation();
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);
}

/**
 * Prüft die aktuelle Orientierung und zeigt/versteckt das Portrait-Overlay.
 * Das Overlay wird nur auf kleinen Geräten im Portrait-Modus angezeigt.
 */
function checkOrientation() {
    let overlay = document.getElementById('portrait-overlay');
    if (!overlay) return;
    
    let isPortrait = window.innerHeight > window.innerWidth;
    let isSmallDevice = window.innerWidth < 900;
    
    if (isPortrait && isSmallDevice) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

function setupRetryButton() {
    let retryBtn = document.getElementById('retry-button');
    if (retryBtn) {
        retryBtn.onclick = () => {
            location.reload();
        };
    }
}

/**
 * Verschiebt die rechte Gruppe der mobilen Buttons nach links, damit der Werfen-Button
 * nicht abgeschnitten wird. Fügt die CSS-Klasse 'shift-left' zur Gruppe hinzu.
 */
function applyRightGroupShift() {
    let rightGroup = document.querySelector('.mobile_controls_right');
    if (rightGroup && !rightGroup.classList.contains('shift-left')) {
        rightGroup.classList.add('shift-left');
    }
}

/**
 * Richtet die mobilen Steuerknöpfe ein und verschiebt bei Bedarf die rechte Gruppe.
 */
function setupMobileControls() {
    setupMobileButton('btn-left', 'left');
    setupMobileButton('btn-right', 'right');
    setupMobileButton('btn-jump', 'up');
    setupMobileButton('btn-throw', 'space');

    // Verschiebe die rechte Button-Gruppe etwas nach links, damit nichts abgeschnitten wird
    applyRightGroupShift();
}

/**
 * Richtet die Buttons fuer Impressum und Spielbeschreibung ein.
 * Die Overlays koennen ueber Buttons geoeffnet und wieder geschlossen werden.
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
 * Oeffnet ein Overlay anhand seiner ID und schliesst vorher ggf. andere Overlays.
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
 * Schliesst ein Overlay anhand seiner ID.
 */
function closeInfoOverlay(overlayId) {
    let overlay = document.getElementById(overlayId);
    if (overlay) {
        overlay.classList.add('d_none');
        overlay.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Schliesst alle vorhandenen Info-Overlays.
 */
function closeAllInfoOverlays() {
    let overlays = document.querySelectorAll('.info_overlay');
    for (let index = 0; index < overlays.length; index++) {
        overlays[index].classList.add('d_none');
        overlays[index].setAttribute('aria-hidden', 'true');
    }
}

/**
 * Blendet die Info-Buttons auf dem Canvas aus.
 */
function hideCanvasInfoButtons() {
    let infoButtons = document.getElementById('canvas-info-buttons');
    if (infoButtons) {
        infoButtons.classList.add('d_none');
    }
}

/**
 * Richtet die Eingabelogik fuer einen mobilen Steuerungsbutton ein.
 */
function setupMobileButton(buttonId, keyboardKey) {
    let btn = document.getElementById(buttonId);
    if (btn) {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[keyboardKey] = true;
        });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[keyboardKey] = false;
        });
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            keyboard[keyboardKey] = true;
        });
        btn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            keyboard[keyboardKey] = false;
        });
    }
}

// Start button: show the game only when user clicks Start
document.addEventListener('DOMContentLoaded', () => {
    // Setup orientation handler
    setupOrientationHandler();
    setupInformationButtons();
    
    let startBtn = document.getElementById('start-button');
    let startScreen = document.getElementById('start-screen');
    if (startBtn && startScreen) {
        startBtn.onclick = () => {
            startScreen.classList.add('hidden');
            hideCanvasInfoButtons();
            closeAllInfoOverlays();
            init();
        };
    }
});

window.addEventListener('keydown', (event) => {
    
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


