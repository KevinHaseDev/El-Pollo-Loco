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
    speed = 2;

    constructor() {
        super()
        this.loadImage(this.images_idle[0]);
        this.loadImages(this.images_idle);
        this.animate(this.images_idle);
        this.playAnimation(this.images_idle);
        this.getRealFrame();
        this.loadImages(this.images_walking);
        // this.animateWalking();


    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.images_idle);
        }, 500);
    }

    // animateWalking() {
    //     if (this.world.character.x >= 3000) {
    //         setInterval(() => {
    //             this.moveLeft();
    //         }, 1000 / 60);
    //     }
    // }
}


