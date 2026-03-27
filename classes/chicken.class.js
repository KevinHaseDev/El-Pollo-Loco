class Chicken extends MovableObject {
    y = 340;
    width = 80;
    height = 80;
    images_walking = [
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ]
    images_dead = [
        './assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]
    realX;
    realY;
    realWidth;
    realHeight;
    offset = {
        left: 10,
        right: 10,
        top: 5,
        bottom: 10
    }
    deadtimer = 0;

    constructor() {
        super(100, 300)
        this.energy = 10;
        this.x = 600 + Math.random() * 3500;
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_dead);
        this.animate();
        this.speed = 2.2 + Math.random() * 0.35;
    }

    animate() {
        setInterval(() => {
            if (this.world && this.world.frozen) return;
            if (!this.isDead()) {
                this.moveLeft();
                this.playAnimation(this.images_walking);
                this.getRealFrame();
            } else {
                this.deadtimer++;
                this.playAnimation([this.images_dead[0]]);
            }
        }, 4000 / 60);
    }
}