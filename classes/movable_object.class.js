class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 200;
    width = 100;
    speed = 0.15;
    imageCache = {};
    currentImage = 0;
    // speedY = 0;
    // acceleration = 0.002;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // applyGravity() {
    //     setInterval(() => {
    //         if (this.isAboveGround() || this.speedY > 0) {
    //             this.y -= this.speedY;
    //             this.speedY -= this.acceleration;
    //         }
    //     }, 1000 / 60);
    // }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    animate(images, interval = 1000 / 60) {
        setInterval(() => {
            this.updateWalkingFrame(images);
        }, interval);
    }

    updateWalkingFrame() {
        let i = this.currentImage % this.images_walking.length;
        let path = this.images_walking[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        setInterval(() => {
            this.x += this.speed;
            if (this.x < -this.width) {
                this.x = 800;
            }
        }, 1000 / 60);

    }
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
            if (this.x < -this.width) {
                this.x = 800;
            }
        }, 1000 / 60);
    }

}