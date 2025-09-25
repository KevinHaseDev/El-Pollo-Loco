class SmallChicken extends Chicken {
    constructor() {
        super();
        this.x = 400 + Math.random() * 3500;
        this.y = 390;
        this.width = 30;
        this.height = 30;
        this.images_walking = [
            '../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            '../assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            '../assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ];
        this.currentImage = 0;
        this.loadImages(this.images_walking);
        this.animate();
    }
}
