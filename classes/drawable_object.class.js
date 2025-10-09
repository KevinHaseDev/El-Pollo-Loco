class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 250;
    height = 200;
    width = 100;

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

    draw(ctx) {
    if (this.img instanceof HTMLImageElement) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } else {
        console.warn('⚠️ draw() ohne gültiges Bild aufgerufen:', this);
    }
}

    
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof SmallChicken || this instanceof Endboss) { // || this instanceof ThrowableObject für Flaschenwurf
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    drawOffsetFrame(ctx) {
        if (this instanceof MovableObject) { // || this instanceof ThrowableObject für Flaschenwurf
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'red';
            ctx.rect(this.realX, this.realY, this.realWidth, this.realHeight);
            ctx.stroke();
        }
    }
}