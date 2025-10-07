class SmallChicken extends MovableObject {
    y = 385;
    width = 30;
    height = 30;
    images_walking = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    realX;
    realY;
    realWidth;
    realHeight;
    offset = {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5
    }

    constructor() {
        super(100, 300);
        this.energy = 10;
        this.x = 400 + Math.random() * 3500;
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.animate(this.images_walking);
        this.speed = 0.3 + Math.random() * 0.35;
        this.animateWalking();
        this.playAnimation(this.images_walking);
        this.getRealFrame();
    }

    animateWalking() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
