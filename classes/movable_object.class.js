class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 200;
    width = 100;
    imageChache = {};

loadImage(path) {
        this.img = new Image();
        this.img.src = path;
}

loadImages(arr) {
    arr.forEach(path => {
        let img = new Image();
        img.src = path;
        this.imageChache[path] = img;
    });
}

    moveRight() {
        console.log("Moving right");
        
    }
    moveLeft() {
    }

}