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
    // smooth-hurt / death helpers
    hurtActive = false;
    hurtDuration = 600; // ms
    deathStarted = false;
    // animation speed controls (ms)
    walkFrameInterval = 180; // slower walking animation
    lastWalkFrame = 0;
    hurtFrameInterval = 200; // slower hurt frame rate
    lastHurtFrame = 0;
    // character tracking
    world = null;
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
    animate() {
        this.handleEndbossMovement();
        this.handleEndbossBehavior();
    }
    handleEndbossMovement() {
        setInterval(() => {
            if (!this.isDead()) {
                // Pause regular movement while hurt to emphasize knockback
                const now = new Date().getTime();
                if (!this.isHurt()) {
                    this.followCharacter();
                    if (now - this.lastWalkFrame > this.walkFrameInterval) {
                        this.playAnimation(this.images_walking);
                        this.lastWalkFrame = now;
                    }
                } else {
                    // play hurt frames at a slower rate
                    if (now - this.lastHurtFrame > this.hurtFrameInterval) {
                        this.playAnimation(this.images_hit);
                        this.lastHurtFrame = now;
                    }
                }
                this.updateEndbossBar();
            }
        }, 1000 / 60);
    }
    handleEndbossBehavior() {
        // Faster tick for responsive animation transitions
        setInterval(() => {
            this.getRealFrame();
            if (this.isHurt()) {
                this.performHurtBehaviorEndboss();
            } else if (this.isDead()) {
                this.performDeathBehaviorEndboss();
            } else if (this.energy < 30) {
                this.performAttackEndboss();
            } else {
                this.performAlertEndboss();
            }
        }, 100);
    }
    performHurtBehaviorEndboss() {
        const now = new Date().getTime();
        const elapsed = now - this.lastHit;
        if (!this.hurtActive) {
            this.hurtActive = true;
            this.hurtStart = now;
            // small upward kick so gravity shows a brief bounce
            this.speedY = 12;
        }
        const t = Math.min(1, elapsed / this.hurtDuration);
        // Knockback that eases out over hurtDuration
        const knockback = 8 * (1 - t);
        this.x -= knockback;
        // hurt frames are advanced from handleEndbossMovement at a controlled rate
        this.endbossBar.setPercentage(this.energy);
        // end hurt state when elapsed exceeds duration
        if (elapsed > this.hurtDuration) {
            this.hurtActive = false;
        }
    }
    performDeathBehaviorEndboss() {
        if (!this.deathStarted) {
            this.deathStarted = true;
            this.deadtimer = 0;
            // make the endboss give a small dramatic jump and fall
            this.speedY = 18;
            this.endbossBar.setVisibility(false);
        }
        this.deadtimer++;
        // slower dead-frame progression for more weight
        if (this.deadtimer % 4 === 0) {
            this.playAnimation(this.images_dead);
        }
        // after a short delay mark as fully dead so game can progress
        if (this.deadtimer > 40) {
            this.dead = true;
        }
    }
    performAttackEndboss() {
        this.followCharacter();
        this.updateEndbossBar();
    }
    performAlertEndboss() {
        this.playAnimation(this.images_idle);
    }
    /**
     * Bewegt den Endboss in Richtung des Charakters (links oder rechts).
     * Aktualisiert auch die Sprite-Richtung entsprechend.
     */
    followCharacter() {
        if (!this.world || !this.world.character) return;
        
        let characterX = this.world.character.x;
        let distanceToCharacter = characterX - this.x;
        
        if (Math.abs(distanceToCharacter) > 50) {
            if (distanceToCharacter < 0) {
                // Charakter ist links vom Endboss
                this.moveLeft();
                this.otherDirection = false;
            } else {
                // Charakter ist rechts vom Endboss
                this.moveRight();
                this.otherDirection = true;
            }
        }
    }
    updateEndbossBar() {
        this.endbossBar.x = this.x + 100;
    }
}



