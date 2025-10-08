class Endboss extends MovableObject {
    x = 3800;
    y = 10;
    height = 450;
    width = 400;
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
    deadcounter = 0;

    constructor() {
        super()
        this.energy = 60;
        this.loadImage(this.images_idle[0]);
        this.loadImages(this.images_idle);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hit);
        
        this.speed = 0.2;
    }

    animate() {
        setInterval(() => {
            if (!this.isDead()) {
                
                this.moveLeft();
                this.playAnimation(this.images_walking);
                this.getRealFrame();
            } else if (this.hit()) {
                this.playAnimation(this.images_hit);
            } else {
                this.deadcounter++;
                this.playAnimation(this.images_dead);
            }
        }, 600);
    }
}



