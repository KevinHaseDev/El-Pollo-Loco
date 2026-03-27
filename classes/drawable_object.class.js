class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 250;
    height = 200;
    width = 100;

    /**
     * Loads one image into the active drawable image slot.
     * @param {string} path Image path.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads multiple images into the cache.
     * @param {string[]} arr Image paths to cache.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the current image on the canvas.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     */
    draw(ctx) {
        if (this.img instanceof HTMLImageElement) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            console.warn('draw() called without a valid image:', this);
        }
    }

    /**
     * Draws debug frame around enemy or character bounds.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof SmallChicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Draws debug frame for collision offset bounds.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     */
    drawOffsetFrame(ctx) {
        if (this instanceof MovableObject) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'red';
            ctx.rect(this.realX, this.realY, this.realWidth, this.realHeight);
            ctx.stroke();
        }
    }
}