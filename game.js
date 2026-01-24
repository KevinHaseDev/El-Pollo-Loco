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
    
    let startBtn = document.getElementById('start-button');
    let startScreen = document.getElementById('start-screen');
    if (startBtn && startScreen) {
        startBtn.addEventListener('click', () => {
            startScreen.classList.add('hidden');
            init();
        });
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


