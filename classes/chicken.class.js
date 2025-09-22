class Chicken extends MovableObject {
    images_walking = [
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ]
    constructor() {
        super(100, 300).loadImage();
        this.width = 80;
        this.height = 80;
        this.x = 400 + Math.random() * 500; // Random x position between 400 and 900
        this.y = 350; // Ground level for chicken
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.animate(this.images_walking, 7000 / 60);
        this.speed=0.15 + Math.random()*0.35;
        this.animateWalking();

    }
    animateWalking () {
        this.moveLeft();
    }

}