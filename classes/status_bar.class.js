class StatusBar extends DrawableObject {

    /**
     * Creates a status bar with predefined frame images.
     * @param {string[]} images Status bar image sequence.
     */
    constructor(images) {
        super();
        this.images = images;
        this.loadImages(this.images);
        this.setPercentage(100);
    }

    /**
     * Updates bar percentage and selects matching image.
     * @param {number} percentage Percentage value from 0 to 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves image index for current percentage.
     * @returns {number} Frame index in image sequence.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}