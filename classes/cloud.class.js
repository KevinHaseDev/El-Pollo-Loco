class Cloud extends MovableObject {
    y = 10;
    height = 300;
    width = 500;
    
    constructor() {
        super(100, 300).loadImage('../assets/img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500; // Random x position between 0 and 500
        this.animateWalking();
    }
    animateWalking() {
        this.moveLeft();
    }

    
}