/**
 * Sound manager class: wraps the AudioHub and UI controls.
 * - Keeps audio logic encapsulated
 * - Handles mute, volume and slider dialog UI
 */
class Sound {
    /**
     * Create Sound manager and wire UI.
     * @param {object} options Optional element id overrides
     */
    constructor(options = {}) {
        this.soundButtonId = options.soundButtonId || 'sound';
        this.labelButtonId = options.labelButtonId || 'audio-label';
        this.sliderDialogId = options.sliderDialogId || 'audio-slider-dialog';
        this.sliderId = options.sliderId || 'audio-slider';
        this.soundButton = document.getElementById(this.soundButtonId);
        this.labelButton = document.getElementById(this.labelButtonId);
        this.dialog = document.getElementById(this.sliderDialogId);
        this.slider = document.getElementById(this.sliderId);
        this.hub = window.audioHub || (typeof AudioHub === 'function' ? new AudioHub() : null);
        this.docClickHandler = null;
        this.escHandler = null;
        this.initUI();
    }

    /** Initialize UI bindings and state. */
    initUI() {
        this.soundButton = document.getElementById(this.soundButtonId);
        this.labelButton = document.getElementById(this.labelButtonId);
        this.dialog = document.getElementById(this.sliderDialogId);
        this.slider = document.getElementById(this.sliderId);
        const muted = this.hub && typeof this.hub.isMuted === 'function' ? this.hub.isMuted() : false;
        if (this.soundButton) this.updateButtonUI(muted);
        if (this.slider) this.slider.value = this.hub && typeof this.hub.masterVolume !== 'undefined' ? this.hub.masterVolume : 1;
    }

    /** Toggle mute and update UI. Returns muted state. */
    toggleMute() {
        let muted = false;
        if (this.hub && typeof this.hub.toggleMute === 'function') muted = this.hub.toggleMute();
        else if (this.soundButton) muted = !(this.soundButton.getAttribute('aria-pressed') === 'true');
        this.updateButtonUI(muted);
        const audioMuteBtn = document.getElementById('audio-mute');
        if (audioMuteBtn) audioMuteBtn.textContent = muted ? 'Unmute' : 'Mute';
        return muted;
    }

    /** Update sound button icon and aria attributes. */
    updateButtonUI(muted) {
        if (!this.soundButton) return;
        this.soundButton.setAttribute('aria-pressed', muted ? 'true' : 'false');
        this.soundButton.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
        const imgSrc = muted ? 'assets/icon/volume_off.svg' : 'assets/icon/volume_up.svg';
        const alt = muted ? 'Muted' : 'Unmuted';
        this.soundButton.innerHTML = '<img src="' + imgSrc + '" alt="' + alt + '">';
    }

    /** Label click handler to toggle the slider dialog. */
    onLabelClick(ev) {
        ev.stopPropagation();
        const isOpen = this.dialog.classList.contains('open');
        this.openDialog(!isOpen);
    }

    /** Open or close the slider dialog. */
    openDialog(show) {
        if (show) {
            this.dialog.classList.add('open');
            this.dialog.setAttribute('aria-hidden', 'false');
            this.labelButton.setAttribute('aria-expanded', 'true');
            // Measure after layout to ensure correct bounding rects
            requestAnimationFrame(() => this.positionDialog());
            this.attachDocumentHandlers();
            return;
        }
        this.dialog.classList.remove('open');
        this.dialog.setAttribute('aria-hidden', 'true');
        this.labelButton.setAttribute('aria-expanded', 'false');
        this.dialog.style.transform = '';
        this.removeDocumentHandlers();
    }

    /** Position the dialog so it remains inside the canvas container. */
    positionDialog() {
        // Anchor dialog to align its right edge with the right edge of the sound button
        this.dialog.style.transform = '';
        this.dialog.style.width = '';

        const wrapper = this.dialog.parentElement || this.labelButton || document.documentElement;
        const container = document.querySelector('.game_area') || document.body;
        const muteBtn = this.soundButton || document.getElementById('sound');
        if (!wrapper || !container) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        let dialogRect = this.dialog.getBoundingClientRect();

        // Ensure dialog width is not larger than the available container space
        const maxAllowedWidth = Math.max(80, containerRect.width - 16);
        if (dialogRect.width > maxAllowedWidth) {
            this.dialog.style.width = maxAllowedWidth + 'px';
            dialogRect = this.dialog.getBoundingClientRect();
        }

        if (muteBtn) {
            const muteRect = muteBtn.getBoundingClientRect();
            // Compute right offset so dialog.right == muteRect.right
            const rightValue = Math.round(wrapperRect.right - muteRect.right);
            this.dialog.style.right = rightValue + 'px';
            this.dialog.style.left = 'auto';

            // Recalculate and nudge if still overflowing container
            dialogRect = this.dialog.getBoundingClientRect();
            const margin = 8;
            if (dialogRect.left < containerRect.left + margin) {
                const shift = Math.ceil((containerRect.left + margin) - dialogRect.left);
                this.dialog.style.transform = 'translateX(' + shift + 'px)';
            } else if (dialogRect.right > containerRect.right - margin) {
                const shift = Math.ceil(dialogRect.right - (containerRect.right - margin));
                this.dialog.style.transform = 'translateX(-' + shift + 'px)';
            }
            return;
        }

        // Fallback: nudge dialog into view if still overflowing
        const overflowRight = dialogRect.right - containerRect.right;
        if (overflowRight > 0) {
            this.dialog.style.transform = 'translateX(-' + Math.ceil(overflowRight + 8) + 'px)';
            return;
        }
        const overflowLeft = containerRect.left - dialogRect.left;
        if (overflowLeft > 0) {
            this.dialog.style.transform = 'translateX(' + Math.ceil(overflowLeft + 8) + 'px)';
            return;
        }
    }

    /** Attach handlers to close the dialog on outside click or Escape. */
    attachDocumentHandlers() {
        this.docClickHandler = (e) => {
            if (
                !this.labelButton.contains(e.target) && !this.dialog.contains(e.target)
            ) this.openDialog(false);
        };
        this.escHandler = (e) => {
            if (
                e.key === 'Escape' || e.key === 'Esc'
            ) this.openDialog(false

            );
        };
        setTimeout(() => {
            document.addEventListener('click', this.docClickHandler);
            document.addEventListener('keydown', this.escHandler);
        }, 0);
    }

    /** Remove previously attached document handlers. */
    removeDocumentHandlers() {
        if (this.docClickHandler) { document.removeEventListener('click', this.docClickHandler); this.docClickHandler = null; }
        if (this.escHandler) { document.removeEventListener('keydown', this.escHandler); this.escHandler = null; }
    }

    /** Register a sound via the underlying hub. */
    registerSound(name, url, options = {}) {
        if (
            this.hub && typeof this.hub.registerSound === 'function'
        ) return this.hub.registerSound(name, url, options);
    }

    /** Play a named sound. */
    play(name) { if (this.hub && typeof this.hub.play === 'function') this.hub.play(name); }

    /** Stop a named sound. */
    stop(name) { if (this.hub && typeof this.hub.stop === 'function') this.hub.stop(name); }

    /** Set master volume. */
    setMasterVolume(v) { if (this.hub && typeof this.hub.setMasterVolume === 'function') this.hub.setMasterVolume(v); }

}

window.sound = new Sound();
