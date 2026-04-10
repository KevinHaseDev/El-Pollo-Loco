class Character extends MovableObject {
    images_idle = [
        './assets/img/2_character_pepe/1_idle/idle/I-1.png',
        './assets/img/2_character_pepe/1_idle/idle/I-2.png',
        './assets/img/2_character_pepe/1_idle/idle/I-3.png',
        './assets/img/2_character_pepe/1_idle/idle/I-4.png',
        './assets/img/2_character_pepe/1_idle/idle/I-5.png',
        './assets/img/2_character_pepe/1_idle/idle/I-6.png',
        './assets/img/2_character_pepe/1_idle/idle/I-7.png',
        './assets/img/2_character_pepe/1_idle/idle/I-8.png',
        './assets/img/2_character_pepe/1_idle/idle/I-9.png',
        './assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    images_idle_long = [
        './assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    images_walking = [
        './assets/img/2_character_pepe/2_walk/W-21.png',
        './assets/img/2_character_pepe/2_walk/W-22.png',
        './assets/img/2_character_pepe/2_walk/W-23.png',
        './assets/img/2_character_pepe/2_walk/W-24.png',
        './assets/img/2_character_pepe/2_walk/W-25.png',
        './assets/img/2_character_pepe/2_walk/W-26.png'
    ];
    images_jumping = [
        './assets/img/2_character_pepe/3_jump/J-31.png',
        './assets/img/2_character_pepe/3_jump/J-32.png',
        './assets/img/2_character_pepe/3_jump/J-33.png',
        './assets/img/2_character_pepe/3_jump/J-34.png',
        './assets/img/2_character_pepe/3_jump/J-35.png',
        './assets/img/2_character_pepe/3_jump/J-36.png',
        './assets/img/2_character_pepe/3_jump/J-37.png',
        './assets/img/2_character_pepe/3_jump/J-38.png',
        './assets/img/2_character_pepe/3_jump/J-39.png',
    ];
    images_hurt = [
        './assets/img/2_character_pepe/4_hurt/H-41.png',
        './assets/img/2_character_pepe/4_hurt/H-42.png',
        './assets/img/2_character_pepe/4_hurt/H-43.png'
    ];
    images_dead = [
        './assets/img/2_character_pepe/5_dead/D-51.png',
        './assets/img/2_character_pepe/5_dead/D-52.png',
        './assets/img/2_character_pepe/5_dead/D-53.png',
        './assets/img/2_character_pepe/5_dead/D-54.png',
        './assets/img/2_character_pepe/5_dead/D-55.png',
        './assets/img/2_character_pepe/5_dead/D-56.png',
        './assets/img/2_character_pepe/5_dead/D-57.png'
    ];
    y = 213;
    currentImage = 0;
    world;
    speed = 5;
    realX;
    realY;
    realWidth;
    realHeight;
    offset = {
        top: 100,
        bottom: 0,
        left: 15,
        right: 50
    };
    energy = 100;
    deadtimer = 0;
    coinAmount = 0;
    bottleAmount = 0;
    isThrowing = false;
    throwAnimationDuration = 400;

    /**
     * Creates the playable character and preloads all animation assets.
     */
    constructor() {
        super(120, 400);
        this.loadImage(this.images_idle[0]);
        this.loadImages(this.images_idle);
        this.loadImages(this.images_idle_long);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hurt);
        this.applyGravity();
        this.animate();
        this.getRealFrame();
    }

    /**
     * Starts movement and animation update loops.
     */
    animate() {
        this.idleStartTime = new Date().getTime();
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Runs the movement update loop.
     */
    startMovementLoop() {
        setInterval(() => {
            if (this.world && this.world.frozen) return;
            this.updateMovementState();
        }, 1000 / 60);
    }

    /**
     * Updates horizontal movement, jump input and camera tracking.
     */
    updateMovementState() {
        this.getRealFrame();
        this.updateHorizontalMovement();
        this.updateJumpMovement();
        this.updateCameraPosition();
    }

    /**
     * Moves the character left or right based on keyboard input.
     */
    updateHorizontalMovement() {
        if (this.world.keyboard.right && this.x < this.world.level.levelEndX) {
            this.moveCharacterToRight();
            return;
        }
        if (this.world.keyboard.left && this.x > 0) {
            this.moveCharacterToLeft();
        }
    }

    /**
     * Triggers a jump when jump input is active.
     */
    updateJumpMovement() {
        if (this.world.keyboard.up && !this.isAboveGround()) {
            this.triggerJumpAction();
        }
    }

    /**
     * Updates horizontal camera offset.
     */
    updateCameraPosition() {
        if (!this.world) return;
        this.world.cameraX = -this.x + 120;
    }

    /**
     * Moves the character to the right.
     */
    moveCharacterToRight() {
        this.moveRight();
        this.otherDirection = false;
        this.idleStartTime = new Date().getTime();
    }

    /**
     * Moves the character to the left.
     */
    moveCharacterToLeft() {
        this.moveLeft();
        this.otherDirection = true;
        this.idleStartTime = new Date().getTime();
    }

    /**
     * Triggers the jump action.
     */
    triggerJumpAction() {
        this.jump();
        this.idleStartTime = new Date().getTime();
        this.playGameSound('playCharacterJump');
    }

    /**
     * Runs the animation selection loop.
     */
    startAnimationLoop() {
        setInterval(() => {
            if (this.world && this.world.frozen) return;
            this.updateAnimationState();
        }, 100);
    }

    /**
     * Selects the active animation based on character state.
     */
    updateAnimationState() {
        let idleDuration = (new Date().getTime() - this.idleStartTime) / 1000;
        if (this.playPriorityAnimation()) {
            this.syncMovementAudio(idleDuration);
            return;
        }
        if (this.isThrowing) {
            this.playAnimation(this.images_walking);
            this.syncMovementAudio(idleDuration);
            return;
        }
        this.selectAnimation(idleDuration);
        this.syncMovementAudio(idleDuration);
    }

    /**
     * Plays hurt, dead, or jump animation if one has priority.
     * @returns {boolean} True when a priority animation was played.
     */
    playPriorityAnimation() {
        if (this.isHurt()) {
            this.hurtAnimation();
            return true;
        }
        if (this.isDead()) {
            this.deadtimer++;
            this.deadAnimation();
            return true;
        }
        if (!this.isAboveGround()) return false;
        this.playAnimation(this.images_jumping);
        return true;
    }

    /**
     * Selects idle or walking animation depending on input and idle time.
     * @param {number} idleDuration Idle duration in seconds.
     */
    selectAnimation(idleDuration) {
        if (this.world.keyboard.right || this.world.keyboard.left) {
            this.playAnimation(this.images_walking);
        } else if (idleDuration > 5) {
            this.playAnimation(this.images_idle_long);
        } else {
            this.playAnimation(this.images_idle);
        }
    }

    syncMovementAudio(idleDuration) {
        if (!window.gameSound) return;
        let isMoving = this.world && (this.world.keyboard.right || this.world.keyboard.left);
        let isRunning = !!isMoving && !this.isAboveGround() && !this.isDead() && !this.isHurt();
        let isSnoring = idleDuration > 5 && !isMoving && !this.isAboveGround() && !this.isDead() && !this.isHurt();
        window.gameSound.syncCharacterMovement(isRunning, isSnoring);
    }

    playGameSound(methodName) {
        if (!window.gameSound) return;
        if (typeof window.gameSound[methodName] === 'function') {
            window.gameSound[methodName]();
        }
    }

    /**
     * Plays the hurt animation sequence.
     */
    hurtAnimation() {
        this.playAnimation(this.images_hurt);
    }

    /**
     * Plays the death animation sequence.
     */
    deadAnimation() {
        this.playAnimation(this.images_dead);
    }

    /**
     * Increases collected coin amount.
     */
    collectCoin() {
        this.coinAmount += 20;
        this.playGameSound('playCollectCoin');
    }

    /**
     * Increases collected bottle amount.
     */
    collectBottle() {
        this.bottleAmount += 20;
        this.playGameSound('playCollectBottle');
    }

    /**
     * Prueft, ob eine Flasche geworfen werden darf.
     * @param {boolean} isSpacePressed Aktueller Space-Status.
     * @param {boolean} canThrow Globaler Wurf-Cooldown-Status.
     * @returns {boolean} True, wenn geworfen werden darf.
     */
    canThrowBottle(isSpacePressed, canThrow) {
        return this.bottleAmount > 0 && isSpacePressed && canThrow;
    }

    /**
     * Berechnet den naechsten Wurfstatus aus Input und Cooldown.
     * @param {boolean} isSpacePressed Aktueller Space-Status.
     * @param {boolean} canThrow Aktueller Cooldown-Status.
     * @returns {{shouldThrow: boolean, canThrow: boolean}} Neuer Wurfstatus.
     */
    resolveThrowState(isSpacePressed, canThrow) {
        if (this.canThrowBottle(isSpacePressed, canThrow)) {
            return {
                shouldThrow: true,
                canThrow: false
            };
        }
        if (!isSpacePressed) {
            return {
                shouldThrow: false,
                canThrow: true
            };
        }
        return {
            shouldThrow: false,
            canThrow
        };
    }

    /**
     * Erstellt ein neues Wurfobjekt an der Character-Position.
     * @returns {ThrowableObject} Das erzeugte Wurfobjekt.
     */
    createThrowableBottle() {
        return new ThrowableObject(this.x + 100, this.y + 100);
    }

    /**
     * Startet die kurze aktive Wurf-Animation.
     */
    startThrowAnimation() {
        this.isThrowing = true;
        this.idleStartTime = new Date().getTime();
        this.playGameSound('playCharacterThrow');
        setTimeout(() => {
            this.isThrowing = false;
        }, this.throwAnimationDuration || 400);
    }

    /** Prueft Stomp-Bedingung von oben auf einen Gegner. */
    isJumpingOnEnemy(enemy) {
        if (!enemy) return false;
        if (typeof enemy.realY !== 'number' || typeof enemy.realHeight !== 'number') return false;
        let characterBottom = this.realY + this.realHeight;
        let enemyStompLimit = enemy.realY + enemy.realHeight * 0.9;
        let isFalling = this.speedY <= 2;
        let isRecentBounce = Date.now() - (this.lastStompAt || 0) < 220;
        let isOnTopHalf = characterBottom <= enemyStompLimit || this.realY <= enemy.realY + enemy.realHeight * 0.6;
        return this.isAboveGround() && (isFalling || isRecentBounce) && isOnTopHalf;
    }

    /**
     * Versucht einen Sprungtreffer auf einen Gegner auszufuehren.
     * @param {MovableObject} enemy Gegnerinstanz.
     * @returns {boolean} True, wenn ein Sprungtreffer passiert ist.
     */
    tryJumpOnEnemy(enemy) {
        if (enemy.isDead()) {
            return false;
        }
        if (this.isColliding(enemy) && this.isJumpingOnEnemy(enemy)) {
            enemy.hit();
            this.lastStompAt = Date.now();
            this.speedY = 15;
            this.playGameSound('playChickenHurt');
            return true;
        }
        return false;
    }

    /**
     * Verarbeitet direkten Gegnerkontakt ohne Sprungtreffer.
     * @param {MovableObject} enemy Gegnerinstanz.
     * @returns {boolean} True, wenn Schaden am Character entstanden ist.
     */
    handleEnemyContact(enemy) {
        if (enemy.isDead()) {
            return false;
        }
        if (this.isColliding(enemy) && !this.isJumpingOnEnemy(enemy)) {
            let previousEnergy = this.energy;
            this.hit();
            if (this.energy < previousEnergy) {
                this.playGameSound('playCharacterHurt');
            }
            return true;
        }
        return false;
    }

    /**
     * Prueft, ob der Character den Lose-Zustand ausloesen soll.
     * @returns {boolean} True, wenn der Character besiegt ist.
     */
    shouldTriggerLoseState() {
        return this.isDead();
    }
}