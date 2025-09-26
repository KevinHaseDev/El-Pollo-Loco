class Cloud extends MovableObject {
    y = 10;
    height = 300;
    width = 500;
    imagesCloud = [
        'assets/img/5_background/layers/4_clouds/1.png',
        'assets/img/5_background/layers/4_clouds/2.png'
    ]

    constructor() {
        super(100, 300)
        this.loadImage(this.imagesCloud[0]);
        this.x = Math.random() * 3500;
    }

    animateWalking() {
        this.moveLeft();
    }

}