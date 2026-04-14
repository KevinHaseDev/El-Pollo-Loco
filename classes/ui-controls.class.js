/**
 * Handles UI interactions for overlays, canvas info controls and audio controls.
 */
class UiControls {
    /**
     * Binds info overlay open and close interactions.
     */
    setupInformationButtons() {
        let imprintButton = document.getElementById('imprint-button');
        let descriptionButton = document.getElementById('description-button');
        let closeButtons = document.querySelectorAll('.info_close_button');
        let overlays = document.querySelectorAll('.info_overlay');

        this.bindInfoOpenButton(imprintButton, 'imprint-overlay');
        this.bindInfoOpenButton(descriptionButton, 'description-overlay');
        this.bindInfoCloseButtons(closeButtons);
        this.bindInfoBackdropClose(overlays);
    }

    /**
     * Binds one button to open an info overlay.
     * @param {HTMLElement | null} button Button element.
     * @param {string} overlayId Target overlay id.
     */
    bindInfoOpenButton(button, overlayId) {
        if (!button) return;
        button.onclick = () => {
            this.openInfoOverlay(overlayId);
        };
    }

    /**
     * Binds all close buttons inside info overlays.
     * @param {NodeListOf<HTMLElement>} closeButtons List of close buttons.
     */
    bindInfoCloseButtons(closeButtons) {
        for (let index = 0; index < closeButtons.length; index++) {
            closeButtons[index].onclick = () => {
                let overlayId = closeButtons[index].getAttribute('data-close-overlay');
                this.closeInfoOverlay(overlayId);
            };
        }
    }

    /**
     * Binds backdrop click handling to close overlays.
     * @param {NodeListOf<HTMLElement>} overlays List of overlay elements.
     */
    bindInfoBackdropClose(overlays) {
        for (let index = 0; index < overlays.length; index++) {
            overlays[index].onclick = (event) => {
                if (event.target === overlays[index]) {
                    this.closeInfoOverlay(overlays[index].id);
                }
            };
        }
    }

    /**
     * Opens one info overlay and hides all others.
     * @param {string} overlayId Overlay id to open.
     */
    openInfoOverlay(overlayId) {
        this.closeAllInfoOverlays();
        let overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.classList.remove('d_none');
            overlay.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Closes one info overlay.
     * @param {string} overlayId Overlay id to close.
     */
    closeInfoOverlay(overlayId) {
        let overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.classList.add('d_none');
            overlay.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Closes all info overlays.
     */
    closeAllInfoOverlays() {
        let overlays = document.querySelectorAll('.info_overlay');
        for (let index = 0; index < overlays.length; index++) {
            overlays[index].classList.add('d_none');
            overlays[index].setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Hides the bottom info button row above the canvas.
     */
    hideCanvasInfoButtons() {
        let infoButtons = document.getElementById('canvas-info-buttons');
        if (infoButtons) {
            infoButtons.classList.add('d_none');
        }
    }

    /**
     * Shows the bottom info button row above the canvas.
     */
    showCanvasInfoButtons() {
        let infoButtons = document.getElementById('canvas-info-buttons');
        if (infoButtons) {
            infoButtons.classList.remove('d_none');
        }
    }

    /**
     * Initializes audio UI bindings and state.
     */
    initSoundUI() {
        if (!window.sound) return;
        if (typeof window.sound.initUI === 'function') window.sound.initUI();
        this.ensureSoundIcon();
        this.bindSoundButton();
        this.bindLabelDialog();
        this.bindSlider();
        this.bindDocumentCloseHandlers();
        this.applyMuteState(this.resolveCurrentMuteState(), false);
    }

    /**
     * Resolves current mute state from active audio hub.
     * @returns {boolean} True when audio is muted.
     */
    resolveCurrentMuteState() {
        if (window.sound && window.sound.hub && typeof window.sound.hub.isMuted === 'function') {
            return window.sound.hub.isMuted();
        }
        if (window.audioHub && typeof window.audioHub.isMuted === 'function') return window.audioHub.isMuted();
        return false;
    }

    /**
     * Ensures the sound button has a visible icon.
     */
    ensureSoundIcon() {
        let button = document.getElementById('sound');
        if (!button) return;
        if (button.innerHTML.trim() === '') {
            button.innerHTML = '<img src="assets/icon/volume_up.svg" alt="Unmuted">';
            button.setAttribute('aria-pressed', 'false');
        }
    }

    /**
     * Binds the mute button interaction.
     */
    bindSoundButton() {
        let button = document.getElementById('sound');
        if (!button || !window.sound) return;
        button.addEventListener('click', () => {
            let muted;
            if (window.sound && typeof window.sound.toggleMute === 'function') {
                muted = window.sound.toggleMute();
            } else if (window.audioHub && typeof window.audioHub.toggleMute === 'function') {
                muted = window.audioHub.toggleMute();
            } else {
                let pressed = button.getAttribute('aria-pressed') === 'true';
                muted = !pressed;
            }
            this.applyMuteState(muted, true);
        });
    }

    /**
     * Binds the volume label button to open or close the slider dialog.
     */
    bindLabelDialog() {
        let label = document.getElementById('audio-label');
        let dialog = document.getElementById('audio-slider-dialog');
        if (!label || !dialog) return;
        label.addEventListener('click', (event) => {
            event.stopPropagation();
            if (dialog.classList.contains('open')) {
                this.closeDialog(label, dialog);
                return;
            }
            this.openDialog(label, dialog);
        });
    }

    /**
     * Opens the slider dialog.
     * @param {HTMLElement} label Toggle label button.
     * @param {HTMLElement} dialog Slider dialog element.
     */
    openDialog(label, dialog) {
        dialog.classList.add('open');
        dialog.setAttribute('aria-hidden', 'false');
        label.setAttribute('aria-expanded', 'true');
        if (typeof window.sound.positionDialog === 'function') window.sound.positionDialog();
    }

    /**
     * Closes the slider dialog.
     * @param {HTMLElement} label Toggle label button.
     * @param {HTMLElement} dialog Slider dialog element.
     */
    closeDialog(label, dialog) {
        dialog.classList.remove('open');
        dialog.setAttribute('aria-hidden', 'true');
        label.setAttribute('aria-expanded', 'false');
    }

    /**
     * Closes the slider dialog on outside click or escape key.
     */
    bindDocumentCloseHandlers() {
        document.addEventListener('click', (event) => {
            let label = document.getElementById('audio-label');
            let dialog = document.getElementById('audio-slider-dialog');
            if (!label || !dialog) return;
            if (!label.contains(event.target) && !dialog.contains(event.target)) this.closeDialog(label, dialog);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' || event.key === 'Esc') {
                let label = document.getElementById('audio-label');
                let dialog = document.getElementById('audio-slider-dialog');
                if (label && dialog) this.closeDialog(label, dialog);
            }
        });
    }

    /**
     * Applies mute or unmute to hub and button state.
     * @param {boolean} muted True to mute.
     * @param {boolean} forceMax True to restore full volume after unmute.
     */
    applyMuteState(muted, forceMax) {
        let button = document.getElementById('sound');
        let slider = document.getElementById('audio-slider');
        if (muted) {
            this.applyMutedState(button, slider);
            return;
        }
        this.applyUnmutedState(button, slider, forceMax);
    }

    /**
     * Applies muted state to hub, slider and button.
     * @param {HTMLElement | null} button Sound button.
     * @param {HTMLInputElement | null} slider Volume slider.
     */
    applyMutedState(button, slider) {
        this.muteAudioHub();
        if (slider) slider.value = 0;
        if (window.sound && typeof window.sound.updateButtonUI === 'function') {
            window.sound.updateButtonUI(true);
            return;
        }
        this.updateMutedButtonFallback(button);
    }

    /**
     * Applies unmuted state to hub, slider and button.
     * @param {HTMLElement | null} button Sound button.
     * @param {HTMLInputElement | null} slider Volume slider.
     * @param {boolean} forceMax True to force max volume.
     */
    applyUnmutedState(button, slider, forceMax) {
        this.unmuteAudioHub();
        if (forceMax) {
            this.setMasterVolumeToMax(slider);
        } else {
            this.syncSliderWithCurrentVolume(slider);
        }
        if (window.sound && typeof window.sound.updateButtonUI === 'function') {
            window.sound.updateButtonUI(false);
            return;
        }
        this.updateUnmutedButtonFallback(button);
    }

    /**
     * Mutes audio through the available audio hub.
     */
    muteAudioHub() {
        if (window.sound && window.sound.hub && typeof window.sound.hub.mute === 'function') {
            window.sound.hub.mute();
            return;
        }
        if (window.audioHub && typeof window.audioHub.mute === 'function') window.audioHub.mute();
    }

    /**
     * Unmutes audio through the available audio hub.
     */
    unmuteAudioHub() {
        if (window.sound && window.sound.hub && typeof window.sound.hub.unmute === 'function') {
            window.sound.hub.unmute();
            return;
        }
        if (window.audioHub && typeof window.audioHub.unmute === 'function') window.audioHub.unmute();
    }

    /**
     * Sets master volume to maximum and synchronizes slider value.
     * @param {HTMLInputElement | null} slider Volume slider.
     */
    setMasterVolumeToMax(slider) {
        if (window.sound && typeof window.sound.setMasterVolume === 'function') window.sound.setMasterVolume(1);
        else if (window.sound && window.sound.hub && typeof window.sound.hub.setMasterVolume === 'function') window.sound.hub.setMasterVolume(1);
        else if (window.audioHub && typeof window.audioHub.setMasterVolume === 'function') window.audioHub.setMasterVolume(1);
        if (slider) slider.value = 1;
    }

    /**
     * Synchronizes slider value with current master volume.
     * @param {HTMLInputElement | null} slider Volume slider.
     */
    syncSliderWithCurrentVolume(slider) {
        let current = (window.sound && window.sound.hub && typeof window.sound.hub.masterVolume !== 'undefined')
            ? window.sound.hub.masterVolume
            : (window.audioHub && typeof window.audioHub.masterVolume !== 'undefined' ? window.audioHub.masterVolume : 1);
        if (slider) slider.value = current || 1;
    }

    /**
     * Fallback UI for muted button state.
     * @param {HTMLElement | null} button Sound button.
     */
    updateMutedButtonFallback(button) {
        if (!button) return;
        button.setAttribute('aria-pressed', 'true');
        button.innerHTML = '<img src="assets/icon/volume_off.svg" alt="Muted">';
    }

    /**
     * Fallback UI for unmuted button state.
     * @param {HTMLElement | null} button Sound button.
     */
    updateUnmutedButtonFallback(button) {
        if (!button) return;
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = '<img src="assets/icon/volume_up.svg" alt="Unmuted">';
    }

    /**
     * Binds slider input to update master volume.
     */
    bindSlider() {
        let slider = document.getElementById('audio-slider');
        if (!slider) return;

        slider.addEventListener('input', (event) => {
            let volume = Number(event.target.value);
            if (window.sound && typeof window.sound.setMasterVolume === 'function') window.sound.setMasterVolume(volume);
            else if (window.sound && window.sound.hub && typeof window.sound.hub.setMasterVolume === 'function') window.sound.hub.setMasterVolume(volume);
            else if (window.audioHub && typeof window.audioHub.setMasterVolume === 'function') window.audioHub.setMasterVolume(volume);
            this.applyMuteState(volume <= 0);
        });

        if (window.sound && window.sound.hub) slider.value = window.sound.hub.masterVolume || 1;
        else if (window.audioHub) slider.value = window.audioHub.masterVolume || 1;
    }
}

window.uiControls = new UiControls();
