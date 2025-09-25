class Endboss extends MovableObject {
    x = 3800;
    y = 10;
    height = 450;
    width = 400;
    images_walking = [
        '../assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    currentImage = 0;

    constructor() {
        super().loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.animate();
        this.updateWalkingFrame(this.images_walking);
    }

    animate() {
        setInterval(() => {
            this.updateWalkingFrame(this.images_walking);
        }, 500);
    }
}
