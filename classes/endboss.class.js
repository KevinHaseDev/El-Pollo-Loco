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
        left: 10,
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
    }

    /**
     * Starts all endboss behavior loops.
     */
    animate() {
        this.handleEndbossMovement();
        this.handleEndbossBehavior();
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
            this.runHurtMovement(now);
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
     * Executes hurt animation movement.
     * @param {number} now Current timestamp in milliseconds.
     */
    runHurtMovement(now) {
        this.playHurtFrame(now);
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
            this.executeBehaviorState();
        }, 100);
    }

    /**
     * Executes the current behavior state.
     */
    executeBehaviorState() {
        if (this.isHurt()) return this.performHurtBehaviorEndboss();
        if (this.isDead()) return this.performDeathBehaviorEndboss();
        if (this.energy < 30) return this.performAttackEndboss();
        this.performAlertEndboss();
    }

    /**
     * Applies knockback and bar updates while hurt.
     */
    performHurtBehaviorEndboss() {
        let now = new Date().getTime();
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
    performDeathBehaviorEndboss() {
        this.startDeathSequence();
        this.updateDeathAnimation();
    }

    /**
     * Initializes death sequence once.
     */
    startDeathSequence() {
        if (this.deathStarted) return;
        this.deathStarted = true;
        this.deadtimer = 0;
        this.speedY = 18;
        this.endbossBar.setVisibility(false);
    }

    /**
     * Advances death animation and final death flag.
     */
    updateDeathAnimation() {
        this.deadtimer++;
        if (this.deadtimer % 4 === 0) {
            this.playAnimation(this.images_dead);
        }
        if (this.deadtimer > 40) {
            this.dead = true;
        }
    }

    /**
     * Executes attack-phase movement.
     */
    performAttackEndboss() {
        this.followCharacter();
        this.updateEndbossBar();
    }

    /**
     * Executes alert animation state.
     */
    performAlertEndboss() {
        this.playAnimation(this.images_idle);
    }

    /**
     * Moves the endboss toward the character.
     */
    followCharacter() {
        if (!this.world || !this.world.character) return;
        let characterX = this.world.character.x;
        let distanceToCharacter = characterX - this.x;
        if (Math.abs(distanceToCharacter) > 50) {
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
}



