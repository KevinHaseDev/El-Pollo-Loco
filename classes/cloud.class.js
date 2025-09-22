class Cloud extends MovableObject {
    y = 10;
    height = 300;
    width = 500;
    constructor() {
        super(100, 300).loadImage('../assets/img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500; // Random x position between 0 and 500
        this.animate();
    }
    animate() {
        setInterval(() => {
            this.x -= 0.15; // Move cloud to the left
            if (this.x < -this.width) {
                this.x = 800; // Reset cloud position to the right side of the canvas
            }
        }, 1000 / 60);  // 60 times per second
    }
}