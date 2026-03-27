class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates one static background tile.
     * @param {string} imagePath Path to the background image.
     * @param {number} x Horizontal world position.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}