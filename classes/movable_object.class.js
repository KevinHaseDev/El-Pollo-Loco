class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 200;
    width = 100;
    speed = 0.15;
    imageCache = {};
    currentImage = 0;


    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

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
                this.x = 800; // Reset cloud position to the right side of the canvas
            }
        }, 1000 / 60);  // 60 times per second

    }
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
            if (this.x < -this.width) {
                this.x = 800; // Reset cloud position to the right side of the canvas
            }
        }, 1000 / 60);  // 60 times per second
    }

}