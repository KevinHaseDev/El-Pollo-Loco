class SmallChicken extends MovableObject {
    y = 385;
    width = 30;
    height = 30;
    images_walking = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    images_dead = ['./assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'];
    realX;
    realY;
    realWidth;
    realHeight;
    offset = {
        left: 5,
        right: 5,
        top: 15,
        bottom: 5
    }
    deadtimer = 0;

    constructor() {
        super(100, 300);
        this.energy = 10;
        this.x = 400 + Math.random() * 3500;
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_dead);
        this.animate();
        this.speed = 0.3 + Math.random() * 0.35; 
    }

    animate() {
        setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
                this.playAnimation(this.images_walking);
                this.getRealFrame();
            } else {
                this.deadtimer++;
                this.playAnimation([this.images_dead[0]]);
            }
        }, 1000 / 60);
    }
}
