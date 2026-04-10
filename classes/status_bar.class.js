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

    /**
     * Calculates collection progress as a percentage.
     * @param {number} collectedAmount Currently collected amount.
     * @param {number} totalAmount Total amount in the level.
     * @returns {number} Percentage value between 0 and 100.
     */
    calculateCollectionPercentage(collectedAmount, totalAmount) {
        if (totalAmount === 0) {
            return 100;
        }
        return Math.min(100, (collectedAmount / totalAmount) * 100);
    }

    /**
     * Sets bar value from collected and total amounts.
     * @param {number} collectedAmount Currently collected amount.
     * @param {number} totalAmount Total amount in the level.
     */
    setCollectionProgress(collectedAmount, totalAmount) {
        let percentage = this.calculateCollectionPercentage(collectedAmount, totalAmount);
        this.setPercentage(percentage);
    }
}
