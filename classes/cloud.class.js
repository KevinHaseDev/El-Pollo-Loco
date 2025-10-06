class Cloud extends MovableObject {
    y = 10;
    height = 300;
    width = 500;
    imagesCloud = [
        './assets/img/5_background/layers/4_clouds/1.png',
        './assets/img/5_background/layers/4_clouds/2.png'
    ]

    constructor() {
        super(100, 300)
        this.loadImage(this.imagesCloud[0]);
        this.x = 400 + Math.random() * 3500;
        this.speed = 0.15 + Math.random() * 0.35;
        this.animate();
    }

    
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60); // 60 FPS
    }

}