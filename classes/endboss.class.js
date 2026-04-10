class Endboss extends MovableObject {
    images_idle = [
        './assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    images_walking = [
        './assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    images_dead = [
        './assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        './assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        './assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    images_hit = [
        './assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    x = 3800;
    y = 10;
    height = 450;
    width = 400;
    currentImage = 0;
    realX;
    realY;
    realWidth;
    realHeight;
    offset = {
        left: 20,
        right: 10,
        top: 10,
        bottom: 10
    };
    deadtimer = 0;
    hurtActive = false;
    hurtDuration = 600;
    deathStarted = false;
    walkFrameInterval = 180;
    lastWalkFrame = 0;
    hurtFrameInterval = 200;
    lastHurtFrame = 0;
    idleFrameInterval = 100;
    lastIdleFrame = 0;
    deathFrameInterval = 400;
    deathSequenceDuration = 4000;
    deathStartTime = 0;
    world = null;

    /**
     * Creates the endboss and preloads all animation assets.
     */
    constructor() {
        super();
        this.energy = 100;
        this.loadImage(this.images_idle[0]);
        this.loadImages(this.images_idle);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hit);
        this.endbossBar = new EndbossBar(this.x + 100, this.y - 10);
        this.speed = 1.5;
        this.handleEndbossBehavior();
    }

    /**
     * Starts all endboss behavior loops.
     */
    animate() {
        this.handleEndbossMovement();
    }

    /**
     * Runs movement and frame updates.
     */
    handleEndbossMovement() {
        setInterval(() => {
            if (this.world && this.world.frozen) return;
            this.updateMovementFrame();
        }, 1000 / 60);
    }

    /**
     * Updates one movement frame for the endboss.
     */
    updateMovementFrame() {
        if (this.isDead()) return;
        let now = new Date().getTime();
        if (this.isHurt()) {
            this.playHurtFrame(now);
        } else {
            this.runRegularMovement(now);
        }
        this.updateEndbossBar();
    }

    /**
     * Executes regular chasing movement.
     * @param {number} now Current timestamp in milliseconds.
     */
    runRegularMovement(now) {
        this.followCharacter();
        this.playWalkFrame(now);
    }

    /**
     * Plays one walking frame if interval elapsed.
     * @param {number} now Current timestamp in milliseconds.
     */
    playWalkFrame(now) {
        if (now - this.lastWalkFrame <= this.walkFrameInterval) return;
        this.playAnimation(this.images_walking);
        this.lastWalkFrame = now;
    }

    /**
     * Plays one hurt frame if interval elapsed.
     * @param {number} now Current timestamp in milliseconds.
     */
    playHurtFrame(now) {
        if (now - this.lastHurtFrame <= this.hurtFrameInterval) return;
        this.playAnimation(this.images_hit);
        this.lastHurtFrame = now;
    }

    /**
     * Runs behavior-state logic loop.
     */
    handleEndbossBehavior() {
        setInterval(() => {
            if (this.world && this.world.frozen) return;
            this.getRealFrame();
            let now = new Date().getTime();
            this.executeBehaviorState(now);
        }, 250);
    }

    /**
     * Executes the current behavior state.
     */
    executeBehaviorState(now) {
        if (this.isHurt()) {
            this.syncEndbossIdleSound(false);
            return this.performHurtBehaviorEndboss(now);
        }
        if (this.isDead()) {
            this.syncEndbossIdleSound(false);
            return this.performDeathBehaviorEndboss(now);
        }
        let shouldPlayIdle = this.world && this.world.character && this.shouldStartMoving(this.world.character.x);
        this.syncEndbossIdleSound(!!shouldPlayIdle);
        if (this.energy < 30) return this.performAttackEndboss(now);
        this.performAlertEndboss(now);
    }

    /**
     * Applies knockback and bar updates while hurt.
     */
    performHurtBehaviorEndboss(now) {
        let elapsed = now - this.lastHit;
        this.activateHurtState(now);
        this.applyHurtKnockback(elapsed);
        this.endbossBar.setPercentage(this.energy);
        this.finishHurtState(elapsed);
    }

    /**
     * Activates hurt state once per hit.
     * @param {number} now Current timestamp in milliseconds.
     */
    activateHurtState(now) {
        if (this.hurtActive) return;
        this.hurtActive = true;
        this.hurtStart = now;
        this.speedY = 12;
    }

    /**
     * Applies smooth hurt knockback.
     * @param {number} elapsed Elapsed hurt time in milliseconds.
     */
    applyHurtKnockback(elapsed) {
        let progress = Math.min(1, elapsed / this.hurtDuration);
        let knockback = 8 * (1 - progress);
        this.x -= knockback;
    }

    /**
     * Ends hurt state after the hurt duration.
     * @param {number} elapsed Elapsed hurt time in milliseconds.
     */
    finishHurtState(elapsed) {
        if (elapsed > this.hurtDuration) {
            this.hurtActive = false;
        }
    }

    /**
     * Executes death sequence behavior.
     */
    performDeathBehaviorEndboss(now) {
        this.startDeathSequence(now);
        this.updateDeathAnimation(now);
    }

    /**
     * Initializes death sequence once.
     */
    startDeathSequence(now) {
        if (this.deathStarted) return;
        this.deathStarted = true;
        this.deadtimer = 0;
        this.deathStartTime = now || new Date().getTime();
        this.speedY = 18;
        this.endbossBar.setVisibility(false);
        this.syncEndbossIdleSound(false);
        if (window.gameSound && typeof window.gameSound.playEndbossDead === 'function') {
            window.gameSound.playEndbossDead();
        }
    }

    /**
     * Controls endboss idle sound through the sound bridge.
     * @param {boolean} isActive True when idle sound should play.
     */
    syncEndbossIdleSound(isActive) {
        if (!window.gameSound) return;
        if (typeof window.gameSound.syncEndbossIdle === 'function') {
            window.gameSound.syncEndbossIdle(isActive);
        }
    }

    /**
     * Advances death animation and final death flag.
     */
    updateDeathAnimation(now) {
        if (!this.deathStartTime) this.deathStartTime = now || new Date().getTime();
        let elapsed = (now || new Date().getTime()) - this.deathStartTime;
        if (elapsed > this.deathSequenceDuration) {
            this.dead = true;
            return;
        }
        let frameIndex = Math.floor(elapsed / this.deathFrameInterval);
        let frame = frameIndex % this.images_dead.length;
        let path = this.images_dead[frame];
        this.img = this.imageCache[path];
    }

    /**
     * Executes attack-phase movement.
     */
    performAttackEndboss(now) {
        this.followCharacter();
        this.updateEndbossBar();
    }

    /**
     * Executes alert animation state.
     */
    performAlertEndboss(now) {
        if (!this.lastIdleFrame) this.lastIdleFrame = now;
        while (now - this.lastIdleFrame >= this.idleFrameInterval) {
            this.playAnimation(this.images_idle);
            this.lastIdleFrame += this.idleFrameInterval;
        }
    }

    /**
     * Moves the endboss toward the character.
     */
    followCharacter() {
        if (!this.world || !this.world.character) return;
        let characterX = this.world.character.x;
        let distanceToCharacter = characterX - this.x;
        if (Math.abs(distanceToCharacter) > 10) {
            if (distanceToCharacter < 0) {
                this.moveLeft();
                this.otherDirection = false;
            } else {
                this.moveRight();
                this.otherDirection = true;
            }
        }
    }

    /**
     * Syncs endboss health bar position with boss position.
     */
    updateEndbossBar() {
        this.endbossBar.x = this.x + 100;
    }

    /**
     * Returns whether endboss active movement should start.
     * @param {number} characterX Current character x position.
     * @returns {boolean} True when endboss should start.
     */
    shouldStartMoving(characterX) {
        return characterX >= 3595 || this.isHurt();
    }

    /**
     * Returns whether endboss defeat should trigger win state.
     * @returns {boolean} True when endboss is defeated.
     */
    shouldTriggerWinState() {
        return this.isDead();
    }
}



