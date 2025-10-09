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
        './assets/img/4_enemie_boss_chicken/5_dead/G26.png',
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

    constructor() {
        super()
        this.energy = 100;
        this.loadImage(this.images_idle[0]);
        this.loadImages(this.images_idle);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hit);
        this.endbossBar = new EndbossBar(this.x + 100, this.y - 10);

        this.speed = 0.2;
    }

    /**
     * Startet die Animation und das Verhalten des Endbosses.
     * @author
     */
    animate() {

        this.handleEndbossMovement();
        this.handleEndbossBehavior();
    }

    /**
     * Steuert die Bewegung des Endbosses nach links, wenn der Charakter in der Nähe ist.
     * @author
     */
    handleEndbossMovement() {
        setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
                this.updateEndbossBar();
            }
        }, 1000 / 60);
    }

    /**
     * Steuert das Verhalten des Endbosses (Hurt, Dead, Attack, Alert, Idle/Attack).
     * @author
     */
    handleEndbossBehavior() {
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
        }, 200);
    }

    /**
     * Führt das Verhalten aus, wenn der Endboss verletzt ist.
     * @author
     */
    performHurtBehaviorEndboss() {
        this.playAnimation(this.images_hit);
        this.endbossBar.setPercentage(this.energy);
        if (!this.isDead()) {
            setTimeout(() => {
                this.playAnimation(this.images_walking);
                this.x -= this.speed;
                this.updateEndbossBar();
            }, 2000);
        }
    }


    /**
     * Führt das Verhalten aus, wenn der Endboss tot ist.
     * @author
     */
    performDeathBehaviorEndboss() {
        this.deadtimer++;
        this.playAnimation(this.images_dead);
        setTimeout(() => this.applyGravity(), 2000);
        setTimeout(() => (this.dead = true), 2000);
        this.endbossBar.setVisibility(false);
    }

    /**
     * Führt den Angriff des Endbosses aus.
     * @author
     */
    performAttackEndboss() {
        this.playAnimation(this.images_walking);
        this.x -= this.speed;
        this.updateEndbossBar();
    }

    /**
     * Führt das Alarm-Verhalten des Endbosses aus.
     * @author
     */
    performAlertEndboss() {
        this.playAnimation(this.images_idle);
    }


    /**
     * Aktualisiert die Position der Endboss-Statusleiste.
     * @author
     */
    updateEndbossBar() {
        this.endbossBar.x = this.x + 100;
    }
}



