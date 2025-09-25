class Chicken extends MovableObject {
    width = 80;
    height = 80;
    y = 350;
    images_walking = [
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ]

    constructor() {
        super(100, 300).loadImage(this.images_walking[0]);
        this.x = 600 + Math.random() * 3500;
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.animate(this.images_walking, 7000 / 60);
        this.speed = 0.15 + Math.random() * 0.35;
        this.animateWalking();
        this.updateWalkingFrame(this.images_walking);
    }

    animateWalking() {
        this.moveLeft();
    }
}