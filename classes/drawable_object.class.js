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
     * Draws object including optional horizontal mirroring.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     */
    drawWithDirection(ctx) {
        if (this.otherDirection) {
            this.flipImage(ctx);
        }
        this.draw(ctx);
        if (this.otherDirection) {
            this.flipImageBack(ctx);
        }
        ctx.restore();
    }

    /**
     * Mirrors the drawing context horizontally for this object.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     */
    flipImage(ctx) {
        ctx.save();
        ctx.translate(this.width, 0);
        ctx.scale(-1, 1);
        this.x = this.x * -1;
    }

    /**
     * Restores the drawing context after mirroring.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     */
    flipImageBack(ctx) {
        ctx.restore();
        this.x = this.x * -1;
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

    /**
     * Zeichnet ein textbasiertes Overlay auf dem Canvas.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {number} canvasWidth Canvas-Breite.
     * @param {number} canvasHeight Canvas-Hoehe.
     * @param {string} text Overlay-Text.
     */
    static drawFallbackOverlay(ctx, canvasWidth, canvasHeight, text) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'white';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
    }

    /**
     * Zeichnet ein zentriertes Bild-Overlay mit vorgegebener Transparenz.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {HTMLImageElement} img Overlay-Bild.
     * @param {number} canvasWidth Canvas-Breite.
     * @param {number} canvasHeight Canvas-Hoehe.
     * @param {number} alpha Transparenzwert von 0 bis 1.
     */
    static drawImageOverlay(ctx, img, canvasWidth, canvasHeight, alpha) {
        ctx.globalAlpha = alpha;
        let targetWidth = canvasWidth * 0.6;
        let scale = (img.width > 0) ? targetWidth / img.width : 1;
        let targetHeight = img.height * scale;
        let x = (canvasWidth - targetWidth) / 2;
        let y = (canvasHeight - targetHeight) / 2;
        ctx.drawImage(img, x, y, targetWidth, targetHeight);
        ctx.globalAlpha = 1;
    }
}
