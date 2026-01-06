
class ThrowableObject extends MovableObject {
    images_rotating = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/5_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/6_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/7_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/8_bottle_rotation.png'
    ];
    images_splash = [
        './assets/img/6_salsa_bottle/bottle_splash/1_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_splash/2_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_splash/3_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_splash/4_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_splash/5_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_splash/6_bottle_splash.png'
    ];
    speedX = 2;
    realX;
    realY;
    realWidth;
    realHeight;
    offset = {
        top: 5,
        bottom: 5,
        left: 15,
        right: 15
    }
    constructor(x, y) {
        super().loadImage('./assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.images_rotating);
        this.loadImages(this.images_splash);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
        this.throw();
    }

    throw() {
        this.isThrown = true;
        this.speedY = 25;
        this.applyGravity();
        setInterval(() => {
            this.getRealFrame();
            this.playAnimation(this.images_rotating);
            this.x += 8;
        }, 1000 / 60);
    }
}


