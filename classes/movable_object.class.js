class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.5;
    energy = 100;
    lastHit = 0;
    groundlevel = 215;

    /**
     * Applies gravity to the object over time.
     */
    applyGravity() {
        setInterval(() => {
            if (this.world && this.world.frozen) return;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = this.groundlevel;
                this.speedY = 0;
            }
        }, 1000 / 60);
    }

    /**
     * Checks whether the object is above its ground level.
     * @returns {boolean} True when object is above ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < this.groundlevel;
        }
    }

    /**
     * Triggers an upward jump impulse.
     */
    jump() {
        this.speedY = 25;
    }

    /**
     * Moves object to the right.
     */
    moveRight() {
        if (this.world && this.world.frozen) return;
        this.x += this.speed;
    }

    /**
     * Moves object to the left.
     */
    moveLeft() {
        if (this.world && this.world.frozen) return;
        this.x -= this.speed;
    }

    /**
     * Calculates collision frame with configured offsets.
     */
    getRealFrame() {
        this.realX = this.x + this.offset.left;
        this.realY = this.y + this.offset.top;
        this.realWidth = this.width - this.offset.right - this.offset.left;
        this.realHeight = this.height - this.offset.bottom - this.offset.top;
    }

    /**
     * Checks collision with another movable object.
     * @param {MovableObject} mo Other movable object.
     * @returns {boolean} True when both hitboxes overlap.
     */
    isColliding(mo) {
        return (
            this.realX + this.realWidth > mo.realX &&
            this.realY + this.realHeight > mo.realY &&
            this.realX < mo.realX + mo.realWidth &&
            this.realY < mo.realY + mo.realHeight
        );
    }

    /**
     * Applies one hit of damage with cooldown.
     */
    hit() {
        if (this.world && this.world.frozen) return;
        let now = new Date().getTime();
        if (now - this.lastHit > 500) {
            this.energy -= 20;
            if (this.energy <= 0) {
                this.energy = 0;
            } else {
                this.lastHit = now;
            }
        }
    }

    /**
     * Checks whether object is still in hurt state.
     * @returns {boolean} True while hurt animation window is active.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 2000;
        return timepassed < 0.2;
    }

    /**
     * Checks whether object has no energy left.
     * @returns {boolean} True when object is dead.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Runs animation and collision-frame updates on interval.
     * @param {string[]} images Animation frame paths.
     * @param {number} interval Update interval in milliseconds.
     */
    animate(images, interval = 1000 / 60) {
        setInterval(() => {
            if (this.world && this.world.frozen) return;
            this.playAnimation(images);
            this.getRealFrame();
        }, interval);
    }

    /**
     * Plays next image from a frame sequence.
     * @param {string[]} images Animation frame paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
